import { useLocation, useNavigate } from 'react-router-dom';

function WagonIcon() {
  return (
    <svg className="wagon-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M14 34h36l4-9H10l4 9z" fill="currentColor" />
      <path d="M16 34v8h32v-8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M24 24c1-8 7-12 13-12s12 4 13 12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="20" cy="48" r="7" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="44" cy="48" r="7" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

export default function ActivityBar({ sidebarCollapsed = false, onToggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="activity-bar" aria-label="Primary">
      <button
        type="button"
        className={pathname === '/' && !sidebarCollapsed ? 'active' : ''}
        aria-label="Explorer"
        onClick={() => {
          if (pathname !== '/') {
            navigate('/');
            return;
          }
          onToggleSidebar?.();
        }}
      >
        <span className="codicon codicon-files" />
      </button>
      <button type="button" aria-label="Search" disabled>
        <span className="codicon codicon-search" />
      </button>
      <button type="button" aria-label="Source Control" disabled>
        <span className="codicon codicon-source-control" />
      </button>
      <button type="button" aria-label="Extensions" disabled>
        <span className="codicon codicon-extensions" />
      </button>
      <button
        type="button"
        className={`activity-bar-bottom ${pathname === '/oregon-trail' ? 'active' : ''}`}
        aria-label="Oregon Trail"
        onClick={() => navigate('/oregon-trail')}
      >
        <WagonIcon />
      </button>
    </nav>
  );
}
