export default function TopBar({
  githubUsername,
  onOpenQuickOpen,
  theme,
  onSetTheme,
  onOpenTrail,
  trailActive = false,
  commandLabel = 'Go to file... (Ctrl+P)'
}) {
  return (
    <header className="gh-topbar">
      <div className="gh-topbar-inner">
        <div className="gh-left">
          <img src="https://prod.r2-perch.app/media/matt-mcguiness.png" alt="Matt McGuiness" className="gh-avatar" />
          <p className="gh-repo">{githubUsername} / personal-website</p>
        </div>
        <button className="gh-command" type="button" onClick={onOpenQuickOpen}>
          {commandLabel}
        </button>
        <div className="gh-right">
          <button
            type="button"
            className={`trail-nav-button ${trailActive ? 'active' : ''}`}
            onClick={onOpenTrail}
            aria-label="Open Oregon Trail"
          >
            Trail
          </button>
          <div className="theme-switch" role="group" aria-label="Color theme">
            <button
              type="button"
              className={theme === 'light' ? 'active' : ''}
              aria-label="Light mode"
              aria-pressed={theme === 'light'}
              onClick={() => onSetTheme('light')}
            >
              ☀
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'active' : ''}
              aria-label="Dark mode"
              aria-pressed={theme === 'dark'}
              onClick={() => onSetTheme('dark')}
            >
              ☾
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
