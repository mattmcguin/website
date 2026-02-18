export default function TopBar({ githubUsername, onOpenQuickOpen, theme, onSetTheme }) {
  return (
    <header className="gh-topbar">
      <div className="gh-topbar-inner">
        <div className="gh-left">
          <span className="gh-mark" aria-hidden="true">
            GH
          </span>
          <p className="gh-repo">{githubUsername} / personal-website</p>
        </div>
        <button className="gh-command" type="button" onClick={onOpenQuickOpen}>
          Go to file... (Ctrl+P)
        </button>
        <div className="gh-right">
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
