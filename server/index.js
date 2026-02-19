import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createDefaultTrailState, normalizeTrailState, stripStateBlock } from '../src/features/oregonTrail/types.js';

function parseEnvValue(rawValue) {
  const value = rawValue.trim();
  if (!value) return '';

  const startsWithSingle = value.startsWith("'");
  const startsWithDouble = value.startsWith('"');
  if ((startsWithSingle || startsWithDouble) && value.endsWith(value[0])) {
    return value.slice(1, -1);
  }

  return value.replace(/\s+#.*$/, '').trim();
}

function loadEnvFile(filePath, loadedFromFiles) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const normalized = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
    const match = normalized.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    const shellDefined = Object.prototype.hasOwnProperty.call(process.env, key) && !loadedFromFiles.has(key);
    if (shellDefined) continue;

    process.env[key] = parseEnvValue(rawValue);
    loadedFromFiles.add(key);
  }
}

function loadEnvFiles() {
  const loadedFromFiles = new Set();
  loadEnvFile(path.resolve(process.cwd(), '.env'), loadedFromFiles);
  loadEnvFile(path.resolve(process.cwd(), '.env.local'), loadedFromFiles);
}

loadEnvFiles();

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const PORT = Number(process.env.OREGON_PROXY_PORT || 8787);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const PRIMARY_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash-lite';
const MODEL_FALLBACKS = (
  process.env.OPENROUTER_MODEL_FALLBACKS ||
  'z-ai/glm-4.7-flash,qwen/qwen3-next-80b-a3b-instruct,moonshotai/kimi-k2.5'
)
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const MODEL_CANDIDATES = Array.from(new Set([PRIMARY_MODEL, ...MODEL_FALLBACKS]));
const REPAIR_MODEL = process.env.OPENROUTER_REPAIR_MODEL || PRIMARY_MODEL;
const OPENROUTER_MAX_TOKENS = Number(process.env.OPENROUTER_MAX_TOKENS || 1100);
const OPENROUTER_TEMPERATURE = Number(process.env.OPENROUTER_TEMPERATURE || 0.85);
const TRANSCRIPT_TURNS = Number(process.env.OPENROUTER_TRANSCRIPT_TURNS || 12);
const TRANSCRIPT_CHARS = Number(process.env.OPENROUTER_TRANSCRIPT_CHARS || 900);
const PROVIDER_SORT = process.env.OPENROUTER_PROVIDER_SORT || 'throughput';
const PROVIDER_SORT_PARTITION = process.env.OPENROUTER_PROVIDER_PARTITION || 'none';
const PROVIDER_MIN_THROUGHPUT = Number(process.env.OPENROUTER_PROVIDER_MIN_THROUGHPUT || 18);
const PROVIDER_MAX_LATENCY = Number(process.env.OPENROUTER_PROVIDER_MAX_LATENCY || 8);
const SITE_URL = process.env.OPENROUTER_SITE_URL || 'http://localhost:5173';
const SITE_NAME = process.env.OPENROUTER_SITE_NAME || 'Personal Website';

class OpenRouterHttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'OpenRouterHttpError';
    this.status = status;
  }
}

function writeJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function writeSse(res, event, payload) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) {
      throw new Error('Request body too large.');
    }
  }

  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON body.');
  }
}

function buildSystemPrompt() {
  return [
    'You are a ruthless 1848 Oregon Trail simulation master.',
    'Tone: immersive, vivid, grim frontier storytelling in second person.',
    'Difficulty: extremely hard. Frequent setbacks, scarcity, disease, and weather risk.',
    'Historical realism: no modern technology exists. Reject anachronisms in-world.',
    'User freedom: player can type any command; resolve it plausibly and specifically.',
    'Output contract:',
    '- Return narrative text first (2-4 concise paragraphs max).',
    '- End every response with exactly one <STATE>...</STATE> block containing valid JSON.',
    '- Do not include markdown code fences around state JSON.',
    '- Keep JSON machine-parseable and deterministic.',
    'Required JSON shape:',
    '{',
    '  "sessionId": string,',
    '  "createdAt": ISO string,',
    '  "updatedAt": ISO string,',
    '  "calendar": { "dateIso": ISO string, "season": string },',
    '  "progress": { "milesTraveled": number, "milesRemaining": number, "landmark": string },',
    '  "party": { "members": [{"name": string, "health": number, "status": string}], "aliveCount": number },',
    '  "resources": { "food": number, "ammo": number, "medicine": number, "clothing": number, "money": number, "oxen": number, "wagonHealth": number },',
    '  "conditions": { "weather": string, "terrain": string, "trailRisk": string },',
    '  "flags": { "won": boolean, "lost": boolean, "lossReason": string, "hardshipCount": number, "anachronismCount": number },',
    '  "turn": { "index": number, "lastCommand": string, "lastOutcomeSummary": string }',
    '}',
    'Win only when Oregon is reached with at least one survivor.',
    'On anachronistic input, narrate failure in-world and increase anachronismCount.',
    'Never break format. Always emit <STATE> JSON at the end.'
  ].join('\n');
}

function compactTranscript(transcript) {
  if (!Array.isArray(transcript)) return [];
  return transcript
    .filter((message) => message && typeof message === 'object')
    .slice(-Math.max(1, TRANSCRIPT_TURNS))
    .map((message) => ({
      role: ['system', 'assistant', 'user'].includes(message.role) ? message.role : 'assistant',
      text: String(message.text || '').slice(-Math.max(120, TRANSCRIPT_CHARS))
    }));
}

function buildTurnMessage({ mode, playerInput, state, transcript, clientHints }) {
  return [
    `Mode: ${mode}`,
    `Player input: ${playerInput || '(start)'}`,
    `Anachronism hint from client: ${clientHints?.anachronisticInput ? 'yes' : 'no'}`,
    'Current state JSON:',
    JSON.stringify(state),
    'Recent transcript JSON:',
    JSON.stringify(compactTranscript(transcript)),
    'Advance the simulation by one coherent turn and return narrative plus <STATE> JSON.'
  ].join('\n\n');
}

function buildProviderPreferences() {
  const normalizedSort = ['price', 'throughput', 'latency'].includes(PROVIDER_SORT) ? PROVIDER_SORT : 'throughput';
  const normalizedPartition = PROVIDER_SORT_PARTITION === 'model' ? 'model' : 'none';

  return {
    allow_fallbacks: true,
    sort: {
      by: normalizedSort,
      partition: normalizedPartition
    },
    preferred_min_throughput: Math.max(1, PROVIDER_MIN_THROUGHPUT),
    preferred_max_latency: Math.max(1, PROVIDER_MAX_LATENCY)
  };
}

const REQUIRED_STATE_KEYS = [
  'sessionId',
  'createdAt',
  'updatedAt',
  'calendar',
  'progress',
  'party',
  'resources',
  'conditions',
  'flags',
  'turn'
];

function looksLikeTrailState(candidate) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return false;
  return REQUIRED_STATE_KEYS.every((key) => Object.prototype.hasOwnProperty.call(candidate, key));
}

function unwrapStateCandidate(candidate) {
  if (looksLikeTrailState(candidate)) return candidate;
  if (
    candidate &&
    typeof candidate === 'object' &&
    !Array.isArray(candidate) &&
    looksLikeTrailState(candidate.state)
  ) {
    return candidate.state;
  }
  return null;
}

function parseStateCandidate(rawCandidate) {
  const cleaned = String(rawCandidate || '')
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
  if (!cleaned) return null;

  try {
    return unwrapStateCandidate(JSON.parse(cleaned));
  } catch {
    return null;
  }
}

function extractBalancedJsonObjects(text, limit = 24) {
  const source = String(text || '');
  const candidates = [];

  let start = -1;
  let depth = 0;
  let inString = false;
  let escaping = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaping) {
        escaping = false;
      } else if (char === '\\') {
        escaping = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      if (depth === 0) start = index;
      depth += 1;
      continue;
    }

    if (char === '}') {
      if (depth === 0) continue;
      depth -= 1;
      if (depth === 0 && start >= 0) {
        candidates.push(source.slice(start, index + 1));
        start = -1;
        if (candidates.length >= limit) break;
      }
    }
  }

  return candidates;
}

function parseStateFromText(rawText) {
  const text = String(rawText || '');
  if (!text.trim()) return null;

  const tried = new Set();
  const attempt = (candidateText, source) => {
    const key = `${source}:${candidateText}`;
    if (tried.has(key)) return null;
    tried.add(key);

    const parsedState = parseStateCandidate(candidateText);
    if (!parsedState) return null;
    return {
      parsedState,
      source,
      matchedText: candidateText
    };
  };

  const stateRegex = /<STATE>\s*([\s\S]*?)\s*<\/STATE>/gi;
  for (const match of text.matchAll(stateRegex)) {
    const candidate = attempt(match[1], 'state-tag');
    if (candidate) return candidate;
  }

  const openStateMatch = text.match(/<STATE>\s*([\s\S]*)$/i);
  if (openStateMatch) {
    const candidate = attempt(openStateMatch[1], 'state-open-tag');
    if (candidate) return candidate;
  }

  const fencedRegex = /```(?:json)?\s*([\s\S]*?)```/gi;
  for (const match of text.matchAll(fencedRegex)) {
    const candidate = attempt(match[1], 'fenced-json');
    if (candidate) return candidate;
  }

  const objectCandidates = extractBalancedJsonObjects(text);
  for (const objectText of objectCandidates) {
    const candidate = attempt(objectText, 'inline-json');
    if (candidate) return candidate;
  }

  const entireTextCandidate = attempt(text, 'whole-text');
  if (entireTextCandidate) return entireTextCandidate;

  return null;
}

function extractState(rawText) {
  const parsed = parseStateFromText(rawText);
  if (!parsed) {
    return {
      narrative: stripStateBlock(rawText),
      parsedState: null,
      error: 'Model output did not include parseable trail state.',
      source: 'none'
    };
  }

  let narrative = stripStateBlock(rawText);
  if (parsed.matchedText) {
    narrative = narrative.split(parsed.matchedText).join(' ').replace(/\n{3,}/g, '\n\n').trim();
  }

  return {
    narrative,
    parsedState: parsed.parsedState,
    error: '',
    source: parsed.source
  };
}

async function openRouterFetch(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': SITE_URL,
      'X-Title': SITE_NAME
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const fallback = `OpenRouter request failed (${response.status})`;
    let message = fallback;
    try {
      const payloadJson = await response.json();
      message = payloadJson?.error?.message || payloadJson?.message || fallback;
    } catch {
      try {
        const raw = await response.text();
        if (raw.trim()) message = raw.trim();
      } catch {
        // Keep fallback message.
      }
    }
    throw new OpenRouterHttpError(response.status, message);
  }

  return response;
}

async function streamOpenRouterTurn({ models, messages, provider, onToken }) {
  const uniqueModels = Array.from(new Set((Array.isArray(models) ? models : []).filter(Boolean)));
  if (!uniqueModels.length) {
    throw new Error('No OpenRouter models were configured.');
  }

  const payload = {
    model: uniqueModels[0],
    models: uniqueModels,
    stream: true,
    temperature: OPENROUTER_TEMPERATURE,
    max_tokens: OPENROUTER_MAX_TOKENS,
    messages,
    provider
  };

  const response = await openRouterFetch(payload);

  if (!response.body) {
    throw new Error('OpenRouter did not provide a response stream.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let raw = '';
  let buffer = '';
  let streamedModel = response.headers.get('x-openrouter-model') || response.headers.get('x-model') || '';
  let finishReason = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    buffer = buffer.replace(/\r/g, '');

    let lineBreak = buffer.indexOf('\n');
    while (lineBreak !== -1) {
      const line = buffer.slice(0, lineBreak).trim();
      buffer = buffer.slice(lineBreak + 1);

      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        if (data === '[DONE]') {
          lineBreak = buffer.indexOf('\n');
          continue;
        }

        try {
          const parsed = JSON.parse(data);
          const token = parsed?.choices?.[0]?.delta?.content;
          const parsedFinishReason = parsed?.choices?.[0]?.finish_reason;
          if (!streamedModel && typeof parsed?.model === 'string') {
            streamedModel = parsed.model;
          }
          if (typeof parsedFinishReason === 'string' && parsedFinishReason) {
            finishReason = parsedFinishReason;
          }
          if (typeof token === 'string' && token.length > 0) {
            raw += token;
            onToken(token);
          }
        } catch {
          // Ignore malformed stream frames.
        }
      }

      lineBreak = buffer.indexOf('\n');
    }
  }

  return { raw, model: streamedModel || uniqueModels[0], finishReason };
}

async function repairState({ rawText, previousState, mode, playerInput }) {
  const firstMessages = [
    {
      role: 'system',
      content:
        'Return only valid JSON for the Oregon Trail game state. Do not include commentary, markdown, or XML tags.'
    },
    {
      role: 'user',
      content: [
        'Previous state JSON:',
        JSON.stringify(previousState, null, 2),
        `Mode: ${mode}`,
        `Player input: ${playerInput || '(start)'}`,
        'Model raw output:',
        rawText,
        'Respond with one corrected JSON object that matches the required game state schema.'
      ].join('\n\n')
    }
  ];

  const response = await openRouterFetch({
    model: REPAIR_MODEL,
    stream: false,
    temperature: 0,
    max_tokens: 1200,
    messages: firstMessages
  });

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content || '';
  const parsedFirst = parseStateFromText(content);
  if (parsedFirst?.parsedState) return parsedFirst.parsedState;

  const strictResponse = await openRouterFetch({
    model: REPAIR_MODEL,
    stream: false,
    temperature: 0,
    max_tokens: 900,
    messages: [
      {
        role: 'system',
        content:
          'Output exactly one valid JSON object for Oregon Trail game state. No markdown, no prose, no XML.'
      },
      {
        role: 'user',
        content: [
          'Required top-level keys:',
          REQUIRED_STATE_KEYS.join(', '),
          'Previous state JSON:',
          JSON.stringify(previousState),
          `Mode: ${mode}`,
          `Player input: ${playerInput || '(start)'}`,
          'Original model output:',
          rawText,
          'Your previous repair output:',
          content,
          'Return exactly one JSON object now.'
        ].join('\n\n')
      }
    ]
  });

  const strictPayload = await strictResponse.json();
  const strictContent = strictPayload?.choices?.[0]?.message?.content || '';
  const parsedStrict = parseStateFromText(strictContent);
  if (parsedStrict?.parsedState) return parsedStrict.parsedState;

  throw new Error('Repair model did not return valid trail state JSON.');
}

function isNarrativeLikelyCutOff(text) {
  const narrative = String(text || '').trim();
  if (!narrative) return true;
  if (narrative.length < 40) return true;
  return !/[.!?]["')\]]?$/.test(narrative);
}

async function recoverNarrative({ mode, playerInput, previousState, nextState, partialNarrative }) {
  const response = await openRouterFetch({
    model: REPAIR_MODEL,
    stream: false,
    temperature: 0.4,
    max_tokens: 260,
    messages: [
      {
        role: 'system',
        content:
          'Rewrite into a complete, immersive Oregon Trail narration. Output plain text only. No JSON, no XML tags.'
      },
      {
        role: 'user',
        content: [
          `Mode: ${mode}`,
          `Player input: ${playerInput || '(start)'}`,
          'Previous state JSON:',
          JSON.stringify(previousState),
          'Resolved next state JSON:',
          JSON.stringify(nextState),
          'Partial narration to complete:',
          partialNarrative || '(none)',
          'Write 3-6 sentences that feel complete and consistent with the resolved next state.'
        ].join('\n\n')
      }
    ]
  });

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content || '';
  return stripStateBlock(String(content || '')).trim();
}

function deriveFallbackState({ previousState, mode, playerInput, narrative }) {
  const base = previousState && typeof previousState === 'object' ? previousState : createDefaultTrailState();
  const now = new Date();
  const previousDate = new Date(base?.calendar?.dateIso || now.toISOString());
  if (mode === 'turn' && Number.isFinite(previousDate.valueOf())) {
    previousDate.setUTCDate(previousDate.getUTCDate() + 1);
  }

  const safeSummary = String(narrative || '').replace(/\s+/g, ' ').trim();
  const prevMilesTraveled = Number(base?.progress?.milesTraveled || 0);
  const prevMilesRemaining = Number(base?.progress?.milesRemaining || 0);
  const fallbackMiles = mode === 'turn' ? Math.max(1, Math.min(8, Math.round(Number(base?.resources?.oxen || 4) / 2))) : 0;
  const milesTraveled = Math.max(0, prevMilesTraveled + fallbackMiles);
  const milesRemaining = Math.max(0, prevMilesRemaining - fallbackMiles);
  const nextTurn = mode === 'turn' ? Number(base?.turn?.index || 0) + 1 : Number(base?.turn?.index || 0);

  return {
    ...base,
    updatedAt: now.toISOString(),
    calendar: {
      ...base.calendar,
      dateIso: Number.isFinite(previousDate.valueOf()) ? previousDate.toISOString() : now.toISOString()
    },
    progress: {
      ...base.progress,
      milesTraveled,
      milesRemaining
    },
    turn: {
      ...base.turn,
      index: nextTurn,
      lastCommand: mode === 'turn' ? playerInput : String(base?.turn?.lastCommand || ''),
      lastOutcomeSummary: (safeSummary || 'A difficult day passes on the trail.').slice(0, 600)
    }
  };
}

function withCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function handleTurnRequest(req, res) {
  if (!OPENROUTER_API_KEY) {
    writeJson(res, 500, { error: 'OPENROUTER_API_KEY is not configured.' });
    return;
  }

  const body = await readBody(req);
  const mode = body.mode === 'start' ? 'start' : 'turn';
  const playerInput = String(body.playerInput || '').trim();

  const fallbackState = createDefaultTrailState(body?.state?.sessionId);
  const previousState = normalizeTrailState(body.state, fallbackState) || fallbackState;
  const transcript = compactTranscript(body.transcript);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive'
  });

  const turnStartedAt = Date.now();

  try {
    const providerPreferences = buildProviderPreferences();
    const messages = [
      {
        role: 'system',
        content: buildSystemPrompt()
      },
      {
        role: 'user',
        content: buildTurnMessage({
          mode,
          playerInput,
          state: previousState,
          transcript,
          clientHints: body.clientHints || {}
        })
      }
    ];

    let streamResult;
    try {
      streamResult = await streamOpenRouterTurn({
        models: MODEL_CANDIDATES,
        messages,
        provider: providerPreferences,
        onToken: (token) => writeSse(res, 'token', { token })
      });
    } catch (error) {
      const canRetryByModel =
        error instanceof OpenRouterHttpError && [400, 404, 422].includes(error.status) && MODEL_CANDIDATES.length > 1;

      if (!canRetryByModel) throw error;

      let recoveredResult = null;
      let lastError = error;
      for (const model of MODEL_CANDIDATES) {
        try {
          recoveredResult = await streamOpenRouterTurn({
            models: [model],
            messages,
            provider: providerPreferences,
            onToken: (token) => writeSse(res, 'token', { token })
          });
          break;
        } catch (modelError) {
          lastError = modelError;
        }
      }

      if (!recoveredResult) throw lastError;
      streamResult = recoveredResult;
    }

    const rawModelText = streamResult.raw;
    const resolvedModel = streamResult.model;

    const extraction = extractState(rawModelText);
    let parsedState = extraction.parsedState;
    let stateSource = extraction.source || 'none';
    const extractedNarrative = stripStateBlock(extraction.narrative || rawModelText);

    if (!parsedState) {
      try {
        parsedState = await repairState({
          rawText: rawModelText,
          previousState,
          mode,
          playerInput
        });
        stateSource = 'repair';
      } catch {
        parsedState = null;
      }
    }

    if (!parsedState) {
      parsedState = deriveFallbackState({
        previousState,
        mode,
        playerInput,
        narrative: extractedNarrative
      });
      stateSource = 'derived-fallback';
    }

    let normalizedState = normalizeTrailState(parsedState, previousState);
    if (!normalizedState) {
      normalizedState = normalizeTrailState(
        deriveFallbackState({
          previousState,
          mode,
          playerInput,
          narrative: extractedNarrative
        }),
        previousState
      );
      stateSource = 'derived-fallback';
    }

    if (!normalizedState) {
      throw new Error(extraction.error || 'Failed to parse trail state from model output.');
    }

    const nextTurnIndex = Math.max(
      normalizedState.turn.index,
      mode === 'start' ? 0 : Number(previousState.turn.index || 0) + 1
    );

    const committedState = {
      ...normalizedState,
      updatedAt: new Date().toISOString(),
      turn: {
        ...normalizedState.turn,
        index: nextTurnIndex,
        lastCommand: mode === 'turn' ? playerInput : normalizedState.turn.lastCommand
      }
    };

    let narrative = extractedNarrative;
    const needsNarrativeRecovery =
      streamResult.finishReason === 'length' ||
      /<STATE>\s*$/i.test(rawModelText) ||
      isNarrativeLikelyCutOff(narrative);

    if (needsNarrativeRecovery) {
      try {
        const recoveredNarrative = await recoverNarrative({
          mode,
          playerInput,
          previousState,
          nextState: committedState,
          partialNarrative: narrative
        });
        if (recoveredNarrative) {
          narrative = recoveredNarrative;
        }
      } catch {
        // Keep best-effort narrative from stream if recovery fails.
      }
    }

    writeSse(res, 'state', {
      state: committedState,
      narrative
    });

    writeSse(res, 'meta', {
      model: resolvedModel,
      durationMs: Date.now() - turnStartedAt,
      outputChars: rawModelText.length,
      finishReason: streamResult.finishReason || 'unknown',
      stateSource,
      providerSort: providerPreferences.sort
    });
    writeSse(res, 'done', { ok: true });
  } catch (error) {
    writeSse(res, 'error', {
      message: error?.message || 'Unknown proxy error while resolving trail turn.'
    });
    writeSse(res, 'done', { ok: false });
  } finally {
    res.end();
  }
}

const server = http.createServer(async (req, res) => {
  withCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    writeJson(res, 200, {
      ok: true,
      model: PRIMARY_MODEL,
      modelCandidates: MODEL_CANDIDATES,
      repairModel: REPAIR_MODEL,
      provider: buildProviderPreferences(),
      generation: {
        maxTokens: OPENROUTER_MAX_TOKENS,
        temperature: OPENROUTER_TEMPERATURE
      },
      hasApiKey: Boolean(OPENROUTER_API_KEY)
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/oregon-trail/turn') {
    try {
      await handleTurnRequest(req, res);
    } catch (error) {
      writeJson(res, 500, {
        error: error?.message || 'Unexpected server error.'
      });
    }
    return;
  }

  writeJson(res, 404, { error: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(`Oregon Trail proxy listening on http://localhost:${PORT}`);
});
