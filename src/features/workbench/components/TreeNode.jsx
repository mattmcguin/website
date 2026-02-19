import { iconClassForPath } from '../utils/fileUtils.js';
import { moveSidebarFocus } from '../utils/keyboardUtils.js';

export default function TreeNode({
  node,
  depth,
  expanded,
  onToggle,
  onOpen,
  activePath,
  parentPath = ''
}) {
  const nodePath = node.folderKey || (parentPath ? `${parentPath}/${node.name}` : node.name);

  function handleFileKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveSidebarFocus(event.currentTarget, 1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveSidebarFocus(event.currentTarget, -1);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      onOpen(node.openPath || node.path);
    }
  }

  if (node.type === 'file') {
    const showChevronSpacer = depth > 0;

    return (
      <li>
        <button
          type="button"
          className={`tree-item file ${activePath === node.path ? 'active' : ''}`}
          style={{ paddingLeft: `${10 + depth * 14}px` }}
          onClick={() => onOpen(node.openPath || node.path)}
          onKeyDown={handleFileKeyDown}
        >
          {showChevronSpacer && <span className="tree-chevron-spacer" aria-hidden="true" />}
          <span className={iconClassForPath(node.path)} aria-hidden="true" />
          {node.name}
        </button>
      </li>
    );
  }

  const isExpanded = expanded.has(nodePath);

  function handleFolderKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveSidebarFocus(event.currentTarget, 1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveSidebarFocus(event.currentTarget, -1);
      return;
    }
    if (event.key === 'ArrowRight' && !isExpanded) {
      event.preventDefault();
      onToggle(nodePath);
      return;
    }
    if (event.key === 'ArrowLeft' && isExpanded) {
      event.preventDefault();
      onToggle(nodePath);
    }
  }

  return (
    <li>
      <button
        type="button"
        className="tree-item folder"
        style={{ paddingLeft: `${10 + depth * 14}px` }}
        onClick={() => onToggle(nodePath)}
        onKeyDown={handleFolderKeyDown}
        aria-expanded={isExpanded}
      >
        <span className={`codicon ${isExpanded ? 'codicon-chevron-down' : 'codicon-chevron-right'}`} />
        <span className={`codicon ${isExpanded ? 'codicon-folder-opened' : 'codicon-folder'}`} aria-hidden="true" />
        {node.name}
      </button>
      {isExpanded && (
        <ul>
          {node.children.map((child) => (
            <TreeNode
              key={child.path || `${nodePath}/${child.name}`}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onOpen={onOpen}
              activePath={activePath}
              parentPath={nodePath}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
