export default function TopBar({
  githubUsername,
  onOpenQuickOpen,
  theme,
  onSetTheme,
  developerModeEnabled = false,
  onToggleDeveloperMode,
  developerModeLabel = "Developer Mode",
}) {
  return (
    <header className="gh-topbar">
      <div className="gh-topbar-inner">
        <div className="gh-left">
          <img
            src="https://prod.r2-perch.app/media/matt-mcguiness.png"
            alt="Matt McGuiness"
            className="gh-avatar"
          />
          <p className="gh-repo">{githubUsername} / personal-website</p>
        </div>
        <button className="gh-command" type="button" onClick={onOpenQuickOpen}>
          Go to file... (Ctrl+P)
        </button>
        <div className="gh-right">
          <div className="theme-switch" role="group" aria-label="Color theme">
            <button
              type="button"
              className={theme === "light" ? "active" : ""}
              aria-label="Light mode"
              aria-pressed={theme === "light"}
              onClick={() => onSetTheme("light")}
            >
              ☀
            </button>
            <button
              type="button"
              className={theme === "dark" ? "active" : ""}
              aria-label="Dark mode"
              aria-pressed={theme === "dark"}
              onClick={() => onSetTheme("dark")}
            >
              ☾
            </button>
          </div>
          {developerModeEnabled && onToggleDeveloperMode ? (
            <button
              type="button"
              className="developer-mode-toggle"
              onClick={onToggleDeveloperMode}
            >
              {developerModeLabel}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
