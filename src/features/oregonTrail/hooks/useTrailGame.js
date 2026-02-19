import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createDefaultTrailState,
  isTrailGameOver,
  normalizeTrailState,
  stripStateBlock
} from '../types.js';
import { streamTrailTurn } from '../services/trailApi.js';
import {
  addLeaderboardEntry,
  clearActiveRun,
  loadActiveRun,
  loadLeaderboard,
  sanitizePlayerName,
  saveActiveRun
} from '../services/trailStorage.js';
import { scoreGame } from '../services/scoreGame.js';

const TRANSCRIPT_CONTEXT_LIMIT = 24;
const TURN_TIMEOUT_MS = 120_000;
const ANACHRONISM_PATTERN = /\b(phone|smart ?phone|gps|google|internet|wifi|uber|lyft|chatgpt|tesla|tiktok|instagram|youtube|email|app|address bar)\b/i;

function createMessage(role, text) {
  const timestamp = new Date().toISOString();
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
    createdAt: timestamp
  };
}

function sanitizeTranscript(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((message) => message && typeof message === 'object')
    .map((message) => ({
      id: String(message.id || createMessage(message.role || 'assistant', '').id),
      role: ['system', 'user', 'assistant'].includes(message.role) ? message.role : 'assistant',
      text: String(message.text || ''),
      createdAt: String(message.createdAt || new Date().toISOString())
    }));
}

function buildContextTranscript(messages) {
  const tail = messages.slice(-TRANSCRIPT_CONTEXT_LIMIT);
  return tail.map((message) => ({
    role: message.role,
    text: message.text.slice(-1800)
  }));
}

function createPersistentSnapshot({ state, transcript, awaitingName, scoreSaved }) {
  return {
    state,
    transcript,
    awaitingName,
    scoreSaved
  };
}

function toVisibleNarrative(rawText) {
  const text = String(rawText || '');
  const fullStateStart = text.search(/<\s*STATE\b/i);
  if (fullStateStart >= 0) {
    return text.slice(0, fullStateStart).trimEnd();
  }

  const partialStateAtEnd = text.match(/<\s*S(?:\s*T(?:\s*A(?:\s*T(?:\s*E?)?)?)?)?$/i);
  if (partialStateAtEnd && Number.isFinite(partialStateAtEnd.index)) {
    return text.slice(0, partialStateAtEnd.index).trimEnd();
  }

  return stripStateBlock(text).trimEnd();
}

export function useTrailGame() {
  const persistedRun = useMemo(() => loadActiveRun(), []);

  const [state, setState] = useState(() => {
    if (!persistedRun?.state) return null;
    const fallback = createDefaultTrailState(persistedRun.state.sessionId);
    return normalizeTrailState(persistedRun.state, fallback);
  });
  const [transcript, setTranscript] = useState(() => sanitizeTranscript(persistedRun?.transcript || []));
  const [leaderboard, setLeaderboard] = useState(() => loadLeaderboard());
  const [awaitingName, setAwaitingName] = useState(Boolean(persistedRun?.awaitingName));
  const [scoreSaved, setScoreSaved] = useState(Boolean(persistedRun?.scoreSaved));
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(Boolean(persistedRun?.state || (persistedRun?.transcript || []).length));

  const stateRef = useRef(state);
  const transcriptRef = useRef(transcript);
  const scoreSavedRef = useRef(scoreSaved);
  const requestAbortRef = useRef(null);
  const bootRequestedRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    scoreSavedRef.current = scoreSaved;
  }, [scoreSaved]);

  useEffect(() => {
    saveActiveRun(createPersistentSnapshot({ state, transcript, awaitingName, scoreSaved }));
  }, [state, transcript, awaitingName, scoreSaved]);

  const finalizeAssistantMessage = useCallback((messageId, finalText) => {
    setTranscript((current) =>
      current.map((message) => {
        if (message.id !== messageId) return message;
        return {
          ...message,
          text: finalText
        };
      })
    );
  }, []);

  const runTrailTurn = useCallback(
    async ({ mode, playerInput, baseState }) => {
      if (isStreaming) return;

      setIsStreaming(true);
      setError('');

      try {
        const currentState = baseState || stateRef.current || createDefaultTrailState();
        const isAnachronisticInput = mode === 'turn' && ANACHRONISM_PATTERN.test(playerInput || '');
        const assistantMessage = createMessage('assistant', '');

        let nextTranscript = transcriptRef.current;
        if (mode === 'start') {
          nextTranscript = [
            createMessage('system', '>> Wagon systems initialized. The year is 1848. The trail is unforgiving.'),
            assistantMessage
          ];
        } else {
          const userMessage = createMessage('user', playerInput);
          nextTranscript = [...transcriptRef.current, userMessage, assistantMessage];
        }

        setTranscript(nextTranscript);

        let aggregatedText = '';
        let finalNarrative = '';
        let nextState = null;
        let streamError = '';
        const turnStartedAt = Date.now();

        try {
          const abortController = new AbortController();
          requestAbortRef.current = abortController;
          const timeoutId = setTimeout(() => abortController.abort(), TURN_TIMEOUT_MS);

          try {
            await streamTrailTurn(
              {
                mode,
                playerInput: mode === 'turn' ? playerInput : '',
                state: currentState,
                transcript: buildContextTranscript(nextTranscript),
                clientHints: {
                  anachronisticInput: isAnachronisticInput
                }
              },
              {
                signal: abortController.signal,
                onEvent: ({ event, data }) => {
                  if (event === 'token') {
                    const token = String(data?.token || '');
                    if (!token) return;
                    aggregatedText += token;
                    finalizeAssistantMessage(assistantMessage.id, toVisibleNarrative(aggregatedText));
                    return;
                  }

                  if (event === 'state') {
                    const normalized = normalizeTrailState(data?.state, currentState);
                    if (normalized) {
                      nextState = normalized;
                    }
                    finalNarrative = stripStateBlock(String(data?.narrative || ''));
                    return;
                  }

                  if (event === 'error') {
                    streamError = String(data?.message || 'The trail server returned an unknown error.');
                    return;
                  }

                  if (event === 'meta') {
                    // Meta payload reserved for telemetry.
                  }
                }
              }
            );
          } finally {
            clearTimeout(timeoutId);
            requestAbortRef.current = null;
          }
        } catch (requestError) {
          if (requestError?.name === 'AbortError') {
            streamError = 'Trail response timed out. Try your command again.';
          } else {
            streamError = requestError?.message || 'Unable to reach the trail server.';
          }
        }

        const narrative = stripStateBlock(finalNarrative || aggregatedText);
        finalizeAssistantMessage(
          assistantMessage.id,
          narrative || 'The prairie wind howls, but no clear outcome reaches your campfire.'
        );

        if (!nextState) {
          setError(streamError || 'The model response was missing valid trail state. Try another command.');
          return;
        }

        if (isAnachronisticInput) {
          const previousCount = Number(stateRef.current?.flags?.anachronismCount || 0);
          if (nextState.flags.anachronismCount <= previousCount) {
            nextState = {
              ...nextState,
              flags: {
                ...nextState.flags,
                anachronismCount: previousCount + 1
              }
            }
          }
        }

        nextState = {
          ...nextState,
          updatedAt: new Date().toISOString()
        };

        setState(nextState);

        if (streamError) {
          setError(streamError);
        } else {
          setError('');
        }

        if (isTrailGameOver(nextState) && !scoreSavedRef.current) {
          setAwaitingName(true);
        }

        const elapsedMs = Date.now() - turnStartedAt;
        if (elapsedMs > 120000) {
          setError('Trail turn completed, but response time was very high.');
        }
      } catch (unexpectedError) {
        const fallbackMessage = unexpectedError?.message || 'Unexpected trail error.';
        setError(fallbackMessage);
      } finally {
        setIsStreaming(false);
      }
    },
    [finalizeAssistantMessage, isStreaming]
  );

  const startNewGame = useCallback(() => {
    if (requestAbortRef.current) {
      requestAbortRef.current.abort();
      requestAbortRef.current = null;
    }

    clearActiveRun();
    setState(null);
    setTranscript([]);
    setAwaitingName(false);
    setScoreSaved(false);
    setError('');
    setStarted(false);
    setIsStreaming(false);
    bootRequestedRef.current = false;
  }, []);

  useEffect(() => {
    if (started || isStreaming || bootRequestedRef.current) return;

    bootRequestedRef.current = true;
    setStarted(true);
    const baseState = createDefaultTrailState();
    setState(baseState);
    void runTrailTurn({ mode: 'start', playerInput: '', baseState });
  }, [started, isStreaming, runTrailTurn]);

  const submitCommand = useCallback(
    async (command) => {
      if (isStreaming) return;
      const trimmed = String(command || '').trim();
      if (!trimmed) return;
      if (isTrailGameOver(stateRef.current)) return;

      await runTrailTurn({ mode: 'turn', playerInput: trimmed, baseState: stateRef.current });
    },
    [isStreaming, runTrailTurn]
  );

  const submitLeaderboardName = useCallback(
    (inputName) => {
      const currentState = stateRef.current;
      if (!currentState || !isTrailGameOver(currentState) || scoreSavedRef.current) {
        return { ok: false, message: 'No completed run is available to save.' };
      }

      const safeName = sanitizePlayerName(inputName);
      const score = scoreGame(currentState);
      const entry = {
        id: `score-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: safeName,
        score,
        won: Boolean(currentState.flags.won),
        milesTraveled: Number(currentState.progress.milesTraveled || 0),
        turns: Number(currentState.turn.index || 0),
        endedAt: new Date().toISOString(),
        lossReason: currentState.flags.lossReason || ''
      };

      const updatedLeaderboard = addLeaderboardEntry(entry);
      setLeaderboard(updatedLeaderboard);
      setScoreSaved(true);
      setAwaitingName(false);
      setError('');

      return {
        ok: true,
        score,
        name: safeName
      };
    },
    []
  );

  const gameOver = isTrailGameOver(state);
  const scorePreview = useMemo(() => (state ? scoreGame(state) : 0), [state]);

  return {
    state,
    transcript,
    leaderboard,
    isStreaming,
    error,
    awaitingName,
    scoreSaved,
    gameOver,
    scorePreview,
    submitCommand,
    submitLeaderboardName,
    startNewGame
  };
}
