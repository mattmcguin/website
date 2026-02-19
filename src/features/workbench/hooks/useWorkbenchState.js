import { useState } from 'react';

export function useWorkbenchState({ defaultFile, defaultOpen, pinnedTabPaths = [] }) {
  const pinnedTabs = new Set(pinnedTabPaths);
  const initialTabs = Array.from(new Set([...pinnedTabPaths, defaultFile]));

  const [expanded, setExpanded] = useState(new Set(defaultOpen));
  const [activePath, setActivePath] = useState(defaultFile);
  const [openTabs, setOpenTabs] = useState(initialTabs);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [quickOpenVisible, setQuickOpenVisible] = useState(false);
  const [quickOpenQuery, setQuickOpenQuery] = useState('');
  const [quickOpenIndex, setQuickOpenIndex] = useState(0);
  const [cursorByPath, setCursorByPath] = useState({ [defaultFile]: { line: 1, column: 1 } });

  function toggleFolder(path) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function collapseAllFolders() {
    setExpanded(new Set());
  }

  function openFile(path) {
    setExpanded((current) => {
      const next = new Set(current);
      const parts = path.split('/');
      for (let index = 0; index < parts.length - 1; index += 1) {
        next.add(parts.slice(0, index + 1).join('/'));
      }
      return next;
    });
    setOpenTabs((current) => (current.includes(path) ? current : [...current, path]));
    setActivePath(path);
  }

  function revealFile(path) {
    setSidebarCollapsed(false);
    setExpanded((current) => {
      const next = new Set(current);
      const parts = path.split('/');
      for (let index = 0; index < parts.length - 1; index += 1) {
        next.add(parts.slice(0, index + 1).join('/'));
      }
      return next;
    });
    setActivePath(path);
  }

  function selectOpenTab(path) {
    revealFile(path);
  }

  function closeTab(path) {
    if (pinnedTabs.has(path)) return;

    setOpenTabs((current) => {
      const next = current.filter((tab) => tab !== path);
      if (path === activePath) {
        const fallback = next[next.length - 1] || pinnedTabPaths[0] || '';
        setActivePath(fallback);
      }
      return next;
    });
  }

  function closeAllTabs() {
    setOpenTabs((current) => current.filter((tab) => pinnedTabs.has(tab)));
    setActivePath(pinnedTabPaths[0] || '');
  }

  function cycleTabs(direction) {
    if (!openTabs.length) return;
    const currentIndex = openTabs.indexOf(activePath);
    if (currentIndex < 0) {
      setActivePath(openTabs[0]);
      return;
    }
    const nextIndex = (currentIndex + direction + openTabs.length) % openTabs.length;
    selectOpenTab(openTabs[nextIndex]);
  }

  function openQuickOpen() {
    setQuickOpenVisible(true);
    setQuickOpenQuery('');
    setQuickOpenIndex(0);
  }

  function closeQuickOpen() {
    setQuickOpenVisible(false);
    setQuickOpenQuery('');
    setQuickOpenIndex(0);
  }

  const cursor = cursorByPath[activePath] || { line: 1, column: 1 };

  return {
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
    setQuickOpenVisible,
    setActivePath,
    toggleFolder,
    collapseAllFolders,
    openFile,
    revealFile,
    selectOpenTab,
    closeTab,
    closeAllTabs,
    cycleTabs,
    openQuickOpen,
    closeQuickOpen
  };
}
