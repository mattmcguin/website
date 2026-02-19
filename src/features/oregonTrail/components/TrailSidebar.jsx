import { useMemo, useState } from 'react';

function formatDate(isoString) {
  const parsed = Date.parse(isoString || '');
  if (!Number.isFinite(parsed)) return 'Unknown';
  return new Date(parsed).toLocaleString();
}

export default function TrailSidebar({
  className,
  state,
  leaderboard,
  gameOver,
  awaitingName,
  scoreSaved,
  scorePreview,
  onSubmitName,
  onStartNewGame
}) {
  const [nameInput, setNameInput] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const milesTraveled = Number(state?.progress?.milesTraveled || 0);
  const milesRemaining = Number(state?.progress?.milesRemaining || 0);
  const totalMiles = Math.max(1, milesTraveled + milesRemaining);
  const progressPercent = Math.max(0, Math.min(100, Math.round((milesTraveled / totalMiles) * 100)));
  const partySize = state?.party?.members?.length || 0;
  const aliveCount = state?.party?.aliveCount || 0;
  const statusTone = useMemo(() => {
    if (!state) return 'cold-start';
    if (state.flags.won) return 'victory';
    if (state.flags.lost) return 'defeat';
    return 'in-progress';
  }, [state]);

  return (
    <aside className={className}>
      <div className="sidebar-section trail-side-head">
        <div className="sidebar-row">
          <p>Trail Control</p>
          <button type="button" className="close-all-editors" onClick={onStartNewGame}>
            New Run
          </button>
        </div>
        <div className={`trail-run-state ${statusTone}`}>
          {state ? (
            <>
              <p>
                <strong>Date:</strong> {formatDate(state.calendar?.dateIso)}
              </p>
              <p>
                <strong>Season:</strong> {state.calendar?.season || 'unknown'}
              </p>
              <p>
                <strong>Location:</strong> {state.progress?.landmark || 'Trail'}
              </p>
              <div className="trail-progress-card" aria-label="Trail progress">
                <div className="trail-progress-row">
                  <strong>Progress</strong>
                  <span>{progressPercent}%</span>
                </div>
                <div className="trail-meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}>
                  <span style={{ width: `${progressPercent}%` }} />
                </div>
                <p>
                  {Math.round(milesTraveled)} mi traveled / {Math.round(milesRemaining)} mi left
                </p>
              </div>
              <p>
                <strong>Party:</strong> {aliveCount}/{partySize} alive
              </p>
              <p>
                <strong>Weather:</strong> {state.conditions?.weather || 'unknown'}
              </p>
            </>
          ) : (
            <p>Preparing wagon state...</p>
          )}
        </div>
      </div>

      <div className="sidebar-section">
        <p>Resources</p>
        <ul className="trail-stat-list">
          <li>Food: {Math.round(state?.resources?.food || 0)}</li>
          <li>Ammo: {Math.round(state?.resources?.ammo || 0)}</li>
          <li>Medicine: {Math.round(state?.resources?.medicine || 0)}</li>
          <li>Clothing: {Math.round(state?.resources?.clothing || 0)}</li>
          <li>Money: ${Math.round(state?.resources?.money || 0)}</li>
          <li>Oxen: {Math.round(state?.resources?.oxen || 0)}</li>
          <li>Wagon Health: {Math.round(state?.resources?.wagonHealth || 0)}%</li>
          <li>Hardships: {Math.round(state?.flags?.hardshipCount || 0)}</li>
          <li>Anachronisms: {Math.round(state?.flags?.anachronismCount || 0)}</li>
          <li>Turn: {Math.round(state?.turn?.index || 0)}</li>
          <li>Projected Score: {scorePreview}</li>
        </ul>
      </div>

      <div className="sidebar-section">
        <p>Conditions</p>
        <div className="trail-chip-wrap">
          <span className="trail-chip">Weather: {state?.conditions?.weather || 'unknown'}</span>
          <span className="trail-chip">Terrain: {state?.conditions?.terrain || 'unknown'}</span>
          <span className="trail-chip">Risk: {state?.conditions?.trailRisk || 'unknown'}</span>
        </div>
        <p className="trail-last-summary">{state?.turn?.lastOutcomeSummary || 'Awaiting your first move.'}</p>
      </div>

      <div className="sidebar-section">
        <p>Party</p>
        <ul className="trail-party-list">
          {(state?.party?.members || []).map((member) => {
            const health = Math.max(0, Math.min(100, Math.round(Number(member.health || 0))));
            return (
              <li key={member.name}>
                <div className="trail-party-head">
                  <span>{member.name}</span>
                  <strong>{health}%</strong>
                </div>
                <div className="trail-member-meter">
                  <span style={{ width: `${health}%` }} />
                </div>
                <p className="trail-party-status">{member.status || 'unknown'}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar-section">
        <p>Leaderboard</p>
        {leaderboard.length ? (
          <ol className="trail-leaderboard">
            {leaderboard.slice(0, 10).map((entry) => (
              <li key={entry.id}>
                <div className="trail-leaderboard-row">
                  <span className="trail-player">{entry.name}</span>
                  <strong>{entry.score}</strong>
                </div>
                <p className="trail-leaderboard-meta">
                  {entry.won ? 'Won' : 'Lost'} · {entry.milesTraveled} mi · {entry.turns} turns
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="repo-status">No runs recorded yet.</p>
        )}
      </div>

      {gameOver && awaitingName ? (
        <div className="sidebar-section">
          <p>Save Score</p>
          <form
            className="trail-name-form"
            onSubmit={(event) => {
              event.preventDefault();
              const result = onSubmitName(nameInput);
              if (result.ok) {
                setSaveMessage(`Saved as ${result.name} (${result.score})`);
                setNameInput('');
              } else {
                setSaveMessage(result.message || 'Unable to save score.');
              }
            }}
          >
            <label htmlFor="trail-player-name">Name</label>
            <input
              id="trail-player-name"
              name="trail-player-name"
              maxLength={24}
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Anonymous Pioneer"
              autoComplete="nickname"
            />
            <button type="submit">Save</button>
          </form>
          {saveMessage ? <p className="repo-status">{saveMessage}</p> : null}
        </div>
      ) : null}

      {gameOver && scoreSaved ? (
        <div className="sidebar-section">
          <p>Run Complete</p>
          <p className="repo-status">Score submitted. Start a new run when ready.</p>
          {state?.flags?.lossReason ? <p className="repo-status error">{state.flags.lossReason}</p> : null}
        </div>
      ) : null}
    </aside>
  );
}
