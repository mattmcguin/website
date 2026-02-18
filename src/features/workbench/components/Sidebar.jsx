import TreeNode from './TreeNode.jsx';
import { iconClassForPath } from '../utils/fileUtils.js';
import { moveSidebarFocus } from '../utils/keyboardUtils.js';

function toSharedRepoTree(nodes, repoName) {
  return nodes.map((node) => {
    if (node.type === 'file') {
      return {
        type: 'file',
        name: node.name,
        path: `github/${repoName}/${node.repoPath}`,
        openPath: node.repoPath
      };
    }

    return {
      type: 'folder',
      name: node.name,
      folderKey: `repo:${repoName}/${node.repoPath}`,
      children: toSharedRepoTree(node.children || [], repoName)
    };
  });
}

export default function Sidebar({
  tree,
  expanded,
  onToggleFolder,
  onOpenFile,
  activePath,
  openTabs,
  onSelectOpenTab,
  onCloseTab,
  onCloseAllTabs,
  githubLoading,
  githubError,
  githubRepos,
  expandedRepos,
  loadingRepoReadme,
  loadingRepoTree,
  repoTreeError,
  repoTrees,
  onToggleRepo,
  onOpenGitHubRepoFile
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-row">
          <p>OPEN EDITORS</p>
          <button type="button" className="close-all-editors" onClick={onCloseAllTabs} disabled={!openTabs.length}>
            Close All
          </button>
        </div>
        <ul className="open-editors">
          {openTabs.map((tabPath) => {
            const name = tabPath.split('/').pop();
            return (
              <li key={`open-${tabPath}`}>
                <div className={`open-editor-row ${activePath === tabPath ? 'active' : ''}`}>
                  <button type="button" className="open-editor-link" onClick={() => onSelectOpenTab(tabPath)}>
                    <span className={iconClassForPath(tabPath)} />
                    <span className="open-editor-name">{name}</span>
                  </button>
                  <button
                    type="button"
                    className="open-editor-close"
                    aria-label={`Close ${name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onCloseTab(tabPath);
                    }}
                  >
                    ×
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar-section">
        <p>EXPLORER</p>
        <ul className="tree-root">
          {tree.map((node) => (
            <TreeNode
              key={node.name}
              node={node}
              depth={0}
              expanded={expanded}
              onToggle={onToggleFolder}
              onOpen={onOpenFile}
              activePath={activePath}
            />
          ))}
        </ul>
      </div>
      <div className="sidebar-section">
        <p>GITHUB REPOS</p>
        {githubLoading ? (
          <p className="repo-status">Loading repositories...</p>
        ) : githubError ? (
          <p className="repo-status error">{githubError}</p>
        ) : (
          <ul className="repo-list">
            {githubRepos.map((repo) => (
              <li key={repo.id}>
                <button
                  type="button"
                  className="tree-item folder repo-root"
                  style={{ paddingLeft: '10px' }}
                  onClick={() => onToggleRepo(repo)}
                  onKeyDown={(event) => {
                    const isExpanded = Boolean(expandedRepos[repo.name]);
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
                      onToggleRepo(repo);
                      return;
                    }
                    if (event.key === 'ArrowLeft' && isExpanded) {
                      event.preventDefault();
                      onToggleRepo(repo);
                    }
                  }}
                  aria-expanded={Boolean(expandedRepos[repo.name])}
                >
                  <span
                    className={`codicon ${expandedRepos[repo.name] ? 'codicon-chevron-down' : 'codicon-chevron-right'}`}
                  />
                  <span className="codicon codicon-repo" />
                  <span className="repo-name">{repo.name}</span>
                  {(loadingRepoReadme[repo.name] || loadingRepoTree[repo.name]) && (
                    <span className="repo-loading">...</span>
                  )}
                </button>
                {expandedRepos[repo.name] && (
                  <>
                    {repoTreeError[repo.name] && <p className="repo-status error">{repoTreeError[repo.name]}</p>}
                    <ul className="repo-tree-inline">
                      {toSharedRepoTree(repoTrees[repo.name] || [], repo.name).map((node) => (
                        <TreeNode
                          key={`${repo.name}/${node.path || node.folderKey || node.name}`}
                          node={node}
                          depth={1}
                          expanded={expanded}
                          onToggle={onToggleFolder}
                          onOpen={(repoPath) => onOpenGitHubRepoFile(repo, repoPath)}
                          activePath={activePath}
                          parentPath={`repo:${repo.name}`}
                        />
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
