import { useEffect, useMemo, useRef, useState } from 'react';

function prefixForRole(role) {
  if (role === 'user') return 'you$';
  if (role === 'system') return 'sys#';
  return 'trail>'; 
}

function labelForRole(role) {
  if (role === 'user') return 'command';
  if (role === 'system') return 'system';
  return 'narrator';
}

export default function TrailTerminal({
  transcript,
  onSubmitCommand,
  isStreaming,
  disabled,
  gameOver,
  error
}) {
  const [command, setCommand] = useState('');
  const outputRef = useRef(null);

  useEffect(() => {
    const node = outputRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [transcript, isStreaming, error]);

  const inputDisabled = disabled || isStreaming || gameOver;
  const hint = useMemo(() => {
    if (gameOver) return 'Run complete. Start a new game to continue.';
    if (isStreaming) return 'The trail master is writing...';
    return 'Type any action and press Enter.';
  }, [gameOver, isStreaming]);

  return (
    <section className="trail-editor" aria-label="Oregon Trail terminal">
      <header className="trail-terminal-header">
        <strong>OREGON TRAIL // TERMINAL</strong>
        <span>{hint}</span>
      </header>

      <div ref={outputRef} className="trail-terminal-output" role="log" aria-live="polite" aria-relevant="additions text">
        {transcript.length === 0 ? (
          <p className="trail-line trail-line-muted">Booting wagon systems...</p>
        ) : (
          transcript.map((message) => (
            <div key={message.id} className={`trail-line trail-line-${message.role}`}>
              <span className="trail-prefix">{prefixForRole(message.role)}</span>
              <div>
                <p className="trail-role">{labelForRole(message.role)}</p>
                <p className="trail-text">{message.text || '...'}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {error ? <p className="trail-error">{error}</p> : null}

      <form
        className="trail-input-form"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = command.trim();
          if (!trimmed || inputDisabled) return;
          onSubmitCommand(trimmed);
          setCommand('');
        }}
      >
        <label htmlFor="trail-command" className="trail-input-label">
          command
        </label>
        <span className="trail-input-prefix">&gt;</span>
        <input
          id="trail-command"
          name="trail-command"
          type="text"
          autoComplete="off"
          spellCheck="false"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="Ex: Hunt near the river at dawn"
          disabled={inputDisabled}
          aria-disabled={inputDisabled}
        />
        <button type="submit" disabled={inputDisabled || !command.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}
