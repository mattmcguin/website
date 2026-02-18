import { iconClassForPath } from '../utils/fileUtils.js';

export default function QuickOpenModal({
  visible,
  query,
  onSetQuery,
  selectedIndex,
  results,
  onSetSelectedIndex,
  onSelectPath,
  onClose,
  onCommit
}) {
  if (!visible) return null;

  return (
    <div className="quick-open-overlay" onClick={onClose}>
      <div className="quick-open" onClick={(event) => event.stopPropagation()}>
        <div className="quick-open-input-wrap">
          <span className="codicon codicon-search" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => onSetQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                onClose();
              }
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                onSetSelectedIndex((current) => (results.length ? (current + 1) % results.length : 0));
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                onSetSelectedIndex((current) => (results.length ? (current - 1 + results.length) % results.length : 0));
              }
              if (event.key === 'Enter') {
                event.preventDefault();
                onCommit();
              }
            }}
            placeholder="Type to search files"
          />
        </div>
        <ul>
          {results.map((path, index) => (
            <li key={path}>
              <button
                type="button"
                className={index === selectedIndex ? 'active' : ''}
                onClick={() => onSelectPath(path)}
              >
                <span className={iconClassForPath(path)} />
                {path}
              </button>
            </li>
          ))}
          {!results.length && <li className="empty">No files match.</li>}
        </ul>
      </div>
    </div>
  );
}
