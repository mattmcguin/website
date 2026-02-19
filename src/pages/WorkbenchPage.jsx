import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ActivityBar from '../features/workbench/components/ActivityBar.jsx';
import WelcomeTab from '../features/workbench/components/WelcomeTab.jsx';
import EditorPane from '../features/workbench/components/EditorPane.jsx';
import QuickOpenModal from '../features/workbench/components/QuickOpenModal.jsx';
import Sidebar from '../features/workbench/components/Sidebar.jsx';
import StatusBar from '../features/workbench/components/StatusBar.jsx';
import TopBar from '../features/workbench/components/TopBar.jsx';
import {
  defaultFile,
  defaultOpen,
  githubUsername,
  introTabPath,
  pinnedTabPaths,
  staticFileContents,
  tree
} from '../features/workbench/constants/workbenchData.js';
import { useGitHubData } from '../features/workbench/hooks/useGitHubData.js';
import { useMarkdownPreview } from '../features/workbench/hooks/useMarkdownPreview.js';
import { useWorkbenchState } from '../features/workbench/hooks/useWorkbenchState.js';
import { isImagePath, isMarkdownPath, languageFromPath, statusLanguage } from '../features/workbench/utils/fileUtils.js';

export default function WorkbenchPage() {
  const githubSyncEnabled = true;
  const [mobileExplorerOpen, setMobileExplorerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const syncingPathFromRouteRef = useRef(false);
  const activePathRef = useRef('');

  const {
    expanded,
    activePath,
    openTabs,
    sidebarCollapsed,
    theme,
    quickOpenVisible,
    quickOpenQuery,
    quickOpenIndex,
    cursorByPath,
    cursor,
    setSidebarCollapsed,
    setTheme,
    setQuickOpenQuery,
    setQuickOpenIndex,
    setCursorByPath,
    toggleFolder,
    collapseAllFolders,
    openFile,
    selectOpenTab,
    closeTab,
    closeAllTabs,
    cycleTabs,
    openQuickOpen,
    closeQuickOpen
  } = useWorkbenchState({ defaultFile, defaultOpen, pinnedTabPaths });

  const githubData = useGitHubData({ githubUsername, openFile, enabled: githubSyncEnabled });
  const dynamicFiles = githubData.dynamicFiles;
  const imageFiles = githubData.imageFileMap;

  const allFiles = useMemo(() => ({ ...staticFileContents, ...dynamicFiles }), [dynamicFiles]);
  const pinnedTabSet = useMemo(() => new Set(pinnedTabPaths), []);
  const allFilePaths = useMemo(
    () => [...new Set([...Object.keys(allFiles), ...Object.keys(imageFiles)])],
    [allFiles, imageFiles]
  );

  const isMarkdown = isMarkdownPath(activePath);
  const isImage = isImagePath(activePath);
  const editorLanguage = languageFromPath(activePath);
  const routeFileParam = useMemo(
    () => new URLSearchParams(location.search).get('file') || '',
    [location.search]
  );
  const routeFileIsValid = useMemo(
    () => !routeFileParam || allFilePaths.includes(routeFileParam),
    [routeFileParam, allFilePaths]
  );
  const resolvedRoutePath = useMemo(
    () => (routeFileIsValid ? (routeFileParam || defaultFile) : defaultFile),
    [routeFileIsValid, routeFileParam]
  );

  const quickOpenResults = useMemo(() => {
    const query = quickOpenQuery.trim().toLowerCase();
    if (!query) return allFilePaths;
    return allFilePaths.filter((path) => path.toLowerCase().includes(query));
  }, [quickOpenQuery, allFilePaths]);

  const { renderedMarkdown, renderingMarkdown } = useMarkdownPreview({
    activePath,
    allFiles,
    isMarkdown,
    githubUsername
  });

  useEffect(() => {
    activePathRef.current = activePath;
  }, [activePath]);

  function buildSearchForPath(path) {
    if (!path || path === defaultFile) return '';
    const params = new URLSearchParams();
    params.set('file', path);
    return `?${params.toString()}`;
  }

  function pushPathToRoute(path, { replace = false } = {}) {
    const nextSearch = buildSearchForPath(path);
    if (location.search === nextSearch) return;
    navigate({ pathname: '/', search: nextSearch }, { replace });
  }

  function handleOpenFile(path) {
    if (path && path !== activePathRef.current) {
      syncingPathFromRouteRef.current = false;
      pushPathToRoute(path, { replace: false });
    }
    openFile(path);
    setMobileExplorerOpen(false);
  }

  function handleSelectOpenTab(path) {
    if (path && path !== activePathRef.current) {
      syncingPathFromRouteRef.current = false;
      pushPathToRoute(path, { replace: false });
    }
    selectOpenTab(path);
    setMobileExplorerOpen(false);
  }

  function handleOpenGitHubRepoFile(repo, repoPath) {
    const routePath = `github/${repo.name}/${repoPath}`;
    syncingPathFromRouteRef.current = false;
    pushPathToRoute(routePath, { replace: false });
    githubData.openGitHubRepoFile(repo, repoPath);
    setMobileExplorerOpen(false);
  }

  const customTabContent = activePath === introTabPath
    ? <WelcomeTab onOpenFile={handleOpenFile} />
    : null;

  function commitQuickOpenSelection() {
    const selected = quickOpenResults[quickOpenIndex] || quickOpenResults[0];
    if (!selected) return;
    handleOpenFile(selected);
    closeQuickOpen();
  }

  function handleEditorMount(editor) {
    const existing = cursorByPath[activePath] || { line: 1, column: 1 };
    editor.setPosition({ lineNumber: existing.line, column: existing.column });
    editor.revealLineInCenter(existing.line);

    editor.onDidChangeCursorPosition((event) => {
      setCursorByPath((current) => ({
        ...current,
        [activePath]: { line: event.position.lineNumber, column: event.position.column }
      }));
    });
  }

  useEffect(() => {
    function onKeyDown(event) {
      const isMeta = event.metaKey || event.ctrlKey;

      if (isMeta && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        openQuickOpen();
        return;
      }

      if (isMeta && event.key.toLowerCase() === 'w') {
        event.preventDefault();
        if (activePath) closeTab(activePath);
        return;
      }

      if (isMeta && event.key === 'Tab') {
        event.preventDefault();
        cycleTabs(event.shiftKey ? -1 : 1);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activePath, closeTab, cycleTabs, openQuickOpen]);

  useEffect(() => {
    setQuickOpenIndex(0);
  }, [quickOpenQuery, setQuickOpenIndex]);

  useEffect(() => {
    if (!mobileExplorerOpen) return undefined;

    function onKeyDown(event) {
      if (event.key === 'Escape') setMobileExplorerOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileExplorerOpen]);

  useEffect(() => {
    if (resolvedRoutePath === activePathRef.current) return;
    syncingPathFromRouteRef.current = true;
    openFile(resolvedRoutePath);
  }, [resolvedRoutePath]);

  useEffect(() => {
    const normalizedActivePath = activePath || defaultFile;
    if (syncingPathFromRouteRef.current) {
      if (normalizedActivePath === resolvedRoutePath) {
        syncingPathFromRouteRef.current = false;
      }
      return;
    }

    if (!routeFileIsValid) {
      navigate({ pathname: '/', search: buildSearchForPath(normalizedActivePath) }, { replace: true });
      return;
    }

    if (resolvedRoutePath === normalizedActivePath) return;

    navigate({ pathname: '/', search: buildSearchForPath(normalizedActivePath) }, { replace: false });
  }, [activePath, routeFileIsValid, resolvedRoutePath, navigate]);

  return (
    <main className={`githubdev-page theme-${theme}`}>
      <div className="githubdev-app">
        <TopBar githubUsername={githubUsername} onOpenQuickOpen={openQuickOpen} theme={theme} onSetTheme={setTheme} />

        <div className={`workbench ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <ActivityBar
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
          />

          <Sidebar
            tree={tree}
            expanded={expanded}
            onToggleFolder={toggleFolder}
            onCollapseAllFolders={collapseAllFolders}
            onOpenFile={handleOpenFile}
            activePath={activePath}
            openTabs={openTabs}
            onSelectOpenTab={handleSelectOpenTab}
            onCloseTab={closeTab}
            onCloseAllTabs={closeAllTabs}
            isTabPinned={(path) => pinnedTabSet.has(path)}
            githubLoading={githubData.githubLoading}
            githubError={githubData.githubError}
            githubRepos={githubData.githubRepos}
            expandedRepos={githubData.expandedRepos}
            loadingRepoTree={githubData.loadingRepoTree}
            repoTreeError={githubData.repoTreeError}
            repoTrees={githubData.repoTrees}
            onToggleRepo={githubData.toggleRepo}
            onOpenGitHubRepoFile={handleOpenGitHubRepoFile}
          />

          <EditorPane
            openTabs={openTabs}
            activePath={activePath}
            onSelectOpenTab={handleSelectOpenTab}
            onCloseTab={closeTab}
            isMarkdown={isMarkdown}
            isImage={isImage}
            imageFiles={imageFiles}
            allFiles={allFiles}
            editorLanguage={editorLanguage}
            theme={theme}
            onEditorMount={handleEditorMount}
            renderedMarkdown={renderedMarkdown}
            renderingMarkdown={renderingMarkdown}
            customTabContent={customTabContent}
            isTabPinned={(path) => pinnedTabSet.has(path)}
          />
        </div>

        <StatusBar language={statusLanguage(activePath)} cursor={cursor} />

        <button
          type="button"
          className="mobile-files-fab"
          aria-label="Open file explorer"
          aria-controls="mobile-file-explorer"
          aria-expanded={mobileExplorerOpen}
          onClick={() => setMobileExplorerOpen(true)}
        >
          <span className="codicon codicon-files" aria-hidden="true" />
          Files
        </button>

        <div
          className={`mobile-explorer-overlay ${mobileExplorerOpen ? 'open' : ''}`}
          aria-hidden={!mobileExplorerOpen}
          onClick={() => setMobileExplorerOpen(false)}
        >
          <section
            id="mobile-file-explorer"
            className="mobile-explorer-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="File explorer"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="mobile-explorer-header">
              <strong>Files</strong>
              <button
                type="button"
                className="mobile-explorer-close"
                onClick={() => setMobileExplorerOpen(false)}
                aria-label="Close file explorer"
              >
                ×
              </button>
            </header>
            <Sidebar
              className="sidebar sidebar-mobile"
              tree={tree}
              expanded={expanded}
              onToggleFolder={toggleFolder}
              onCollapseAllFolders={collapseAllFolders}
              onOpenFile={handleOpenFile}
              activePath={activePath}
              openTabs={openTabs}
              onSelectOpenTab={handleSelectOpenTab}
              onCloseTab={closeTab}
              onCloseAllTabs={closeAllTabs}
              isTabPinned={(path) => pinnedTabSet.has(path)}
              githubLoading={githubData.githubLoading}
              githubError={githubData.githubError}
              githubRepos={githubData.githubRepos}
              expandedRepos={githubData.expandedRepos}
              loadingRepoTree={githubData.loadingRepoTree}
              repoTreeError={githubData.repoTreeError}
              repoTrees={githubData.repoTrees}
              onToggleRepo={githubData.toggleRepo}
              onOpenGitHubRepoFile={handleOpenGitHubRepoFile}
            />
          </section>
        </div>

        <QuickOpenModal
          visible={quickOpenVisible}
          query={quickOpenQuery}
          onSetQuery={setQuickOpenQuery}
          selectedIndex={quickOpenIndex}
          results={quickOpenResults}
          onSetSelectedIndex={setQuickOpenIndex}
          onSelectPath={(path) => {
            handleOpenFile(path);
            closeQuickOpen();
          }}
          onClose={closeQuickOpen}
          onCommit={commitQuickOpenSelection}
        />
      </div>
    </main>
  );
}
