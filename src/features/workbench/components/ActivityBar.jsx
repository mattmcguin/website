export default function ActivityBar({ sidebarCollapsed, onToggleSidebar }) {
  return (
    <nav className="activity-bar" aria-label="Primary">
      <button
        type="button"
        className={sidebarCollapsed ? '' : 'active'}
        aria-label="Explorer"
        onClick={onToggleSidebar}
      >
        <span className="codicon codicon-files" />
      </button>
      <button type="button" aria-label="Search">
        <span className="codicon codicon-search" />
      </button>
      <button type="button" aria-label="Source Control">
        <span className="codicon codicon-source-control" />
      </button>
      <button type="button" aria-label="Extensions">
        <span className="codicon codicon-extensions" />
      </button>
    </nav>
  );
}
