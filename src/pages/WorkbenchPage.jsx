import { useEffect, useMemo, useState } from 'react';
import ActivityBar from '../features/workbench/components/ActivityBar.jsx';
import EditorPane from '../features/workbench/components/EditorPane.jsx';
import QuickOpenModal from '../features/workbench/components/QuickOpenModal.jsx';
import Sidebar from '../features/workbench/components/Sidebar.jsx';
import StoryLanding from '../features/workbench/components/StoryLanding.jsx';
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
import { isImagePath, languageFromPath, statusLanguage } from '../features/workbench/utils/fileUtils.js';

export default function WorkbenchPage() {
  const [mobileExplorerOpen, setMobileExplorerOpen] = useState(false);

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
    openFile,
    selectOpenTab,
    closeTab,
    closeAllTabs,
    cycleTabs,
    openQuickOpen,
    closeQuickOpen
  } = useWorkbenchState({ defaultFile, defaultOpen, pinnedTabPaths });

  const githubData = useGitHubData({ githubUsername, openFile });
  const dynamicFiles = githubData.dynamicFiles;
  const imageFiles = githubData.imageFileMap;

  const allFiles = useMemo(() => ({ ...staticFileContents, ...dynamicFiles }), [dynamicFiles]);
  const pinnedTabSet = useMemo(() => new Set(pinnedTabPaths), []);
  const allFilePaths = useMemo(
    () => [...new Set([...Object.keys(allFiles), ...Object.keys(imageFiles)])],
    [allFiles, imageFiles]
  );

  const isMarkdown = Boolean(activePath) && activePath.endsWith('.md');
  const isImage = isImagePath(activePath);
  const editorLanguage = languageFromPath(activePath);

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

  function handleOpenFile(path) {
    openFile(path);
    setMobileExplorerOpen(false);
  }

  function handleSelectOpenTab(path) {
    selectOpenTab(path);
    setMobileExplorerOpen(false);
  }

  function handleOpenGitHubRepoFile(repo, repoPath) {
    githubData.openGitHubRepoFile(repo, repoPath);
    setMobileExplorerOpen(false);
  }

  const customTabContent =
    activePath === introTabPath ? <StoryLanding onOpenFile={handleOpenFile} /> : null;

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
            onSelectOpenTab={selectOpenTab}
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
