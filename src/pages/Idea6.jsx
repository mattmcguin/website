import Editor from '@monaco-editor/react';
import { useEffect, useMemo, useState } from 'react';

const staticFileContents = {
  'portfolio-site/README.md': `# mattmcguin.com

Portfolio site focused on recent software work.

## About
I build practical software systems that help teams ship faster.
This portfolio is intentionally structured like a repository so the work feels tangible.

## Current Focus
- AI-assisted developer workflows
- Production reliability and observability
- UX systems for internal tools
- Tooling that lowers onboarding friction

## Selected Projects
### AI Prompt Ops Toolkit
- Built reusable prompt macros for recurring workflows
- Added evaluation checklists for safer production behavior
- Standardized collaboration patterns across product teams

### Realtime Analytics Surface
- Reworked event ingestion paths for lower latency
- Added schema guardrails to reduce noisy data
- Improved debugging with richer trace context

### Design Token Sync
- Centralized token publishing and validation
- Reduced drift between product surfaces
- Improved release confidence for frontend teams

## Public Repositories
### prompt-ops-toolkit
- Command templates and operator runbooks
- Prompt evaluation guidance
- Lightweight scripts for local testing

### ui-token-sync
- Schema validation and release automation
- Multi-app distribution support
- Change visibility via CI annotations

### fast-insight-pipeline
- Query planning improvements
- Throughput and storage optimizations
- Data lifecycle hygiene and retention safeguards

## Working Principles
1. Ship small and iterate with real feedback.
2. Make tradeoffs explicit in code and docs.
3. Optimize for maintainability over novelty.
4. Prefer clear ownership boundaries.
5. Leave systems easier to operate than before.

## Project Log 2026
### January
- Shipped first pass of prompt quality checks
- Added onboarding docs for internal contributors
- Benchmarked analytics query performance baselines

### February
- Reduced dashboard latency on key views
- Added audit events for command-level visibility
- Published clearer architecture decision records

### March
- Improved release scripting and rollback process
- Aligned token naming conventions across apps
- Added safeguards for edge-case data payloads

### April
- Reworked CI caching for more stable build times
- Tightened API error handling and logging
- Improved issue triage process for faster follow-up

### May
- Streamlined local setup scripts for new developers
- Added health scorecard for repository maintenance
- Simplified stale dependency review process

### June
- Integrated quality checks into pre-merge flow
- Refined docs for debugging incident timelines
- Improved deployment visibility for stakeholders

### July
- Added runbooks for recurring support workflows
- Consolidated internal templates for consistency
- Reduced ambiguity in ownership handoffs

### August
- Expanded test coverage for core user paths
- Improved design review handoff protocol
- Hardened analytics ingestion against malformed events

### September
- Added release-notes automation helper
- Refined backlog slicing strategy for weekly cadence
- Improved instrumentation naming consistency

### October
- Tightened rate-limit handling across services
- Improved snapshot performance for large datasets
- Documented fallback strategies for critical workflows

### November
- Reduced noisy alerting by tuning thresholds
- Added examples for common extension points
- Clarified repository contribution model

### December
- Wrapped year-end reliability improvements
- Finalized migration notes for legacy modules
- Published annual engineering learnings

## Architecture Notes
### Data Boundaries
Define ownership early. Keep contracts explicit and versioned.

### Reliability
Design for observability first, then optimize bottlenecks with measurement.

### Frontend Systems
Treat design tokens and component APIs as product surfaces.

### Developer Experience
If setup is hard, contribution velocity drops. Optimize the first hour.

## Learning Backlog
- Better long-term maintainability metrics
- Faster root-cause workflows for incidents
- Improved knowledge transfer patterns
- Lightweight performance budgets for new features
- Automated quality signals for pull requests

## Next Experiments
- Context-aware code generation prompts
- Auto-suggested runbooks from issue clusters
- Better repository maps for new contributors
- Structured weekly engineering notes

## Contact
- GitHub: @mattmcguin
- Website: mattmcguin.com
- Focus: pragmatic engineering systems

## Appendix A: Notes
- This file is intentionally long to test scroll behavior.
- Preview mode should remain readable at long lengths.
- Markdown mode should keep line numbers aligned.
- Tabs and side panels should stay usable while scrolling.

## Appendix B: Additional Notes
- Keep interactions predictable.
- Preserve keyboard-friendly navigation patterns.
- Ensure responsive behavior on smaller screens.
- Prefer accessible contrast across all interface states.

## Appendix C: Deep Dive Topics
- Prompt evaluation lifecycle
- Incident communication standards
- Internal tooling prioritization
- Documentation upkeep model
- Sustainable release cadence

## End
Thanks for reading this intentionally long README.`,
  'portfolio-site/projects/ai-ops.md': `## AI Prompt Ops Toolkit

- Built reusable prompt command macros
- Added evaluation checklists for reliability
- Cut iteration loops for product teams`,
  'portfolio-site/projects/analytics-surface.md': `## Realtime Analytics Surface

- Event ingestion guardrails
- Query latency optimization
- Better debugging traces for production`,
  'portfolio-site/src/app.tsx': `export function AppShell() {
  return {
    nowBuilding: 'github.dev-inspired portfolio',
    focus: ['project narrative', 'ship cadence', 'public repos']
  };
}`,
  'public-repos/prompt-ops-toolkit/README.md': `### prompt-ops-toolkit

Reusable command templates, evaluation scripts,
and deployment notes for prompt workflows.`,
  'public-repos/ui-token-sync/README.md': `### ui-token-sync

Design token publishing pipeline with checks:
- schema validation
- semver release gates
- multi-app sync automation`,
  'public-repos/fast-insight-pipeline/README.md': `### fast-insight-pipeline

Streaming events and query planner improvements
to reduce dashboard load times and cost.`
};

const tree = [
  {
    type: 'folder',
    name: 'portfolio-site',
    children: [
      { type: 'file', name: 'README.md', path: 'portfolio-site/README.md' },
      {
        type: 'folder',
        name: 'projects',
        children: [
          { type: 'file', name: 'ai-ops.md', path: 'portfolio-site/projects/ai-ops.md' },
          {
            type: 'file',
            name: 'analytics-surface.md',
            path: 'portfolio-site/projects/analytics-surface.md'
          }
        ]
      },
      {
        type: 'folder',
        name: 'src',
        children: [{ type: 'file', name: 'app.tsx', path: 'portfolio-site/src/app.tsx' }]
      }
    ]
  },
  {
    type: 'folder',
    name: 'public-repos',
    children: [
      {
        type: 'folder',
        name: 'prompt-ops-toolkit',
        children: [{ type: 'file', name: 'README.md', path: 'public-repos/prompt-ops-toolkit/README.md' }]
      },
      {
        type: 'folder',
        name: 'ui-token-sync',
        children: [{ type: 'file', name: 'README.md', path: 'public-repos/ui-token-sync/README.md' }]
      },
      {
        type: 'folder',
        name: 'fast-insight-pipeline',
        children: [{ type: 'file', name: 'README.md', path: 'public-repos/fast-insight-pipeline/README.md' }]
      }
    ]
  }
];

const defaultOpen = new Set([
  'portfolio-site',
  'portfolio-site/projects',
  'portfolio-site/src',
  'public-repos',
  'public-repos/prompt-ops-toolkit'
]);
const defaultFile = 'portfolio-site/README.md';
const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'mattmcguin';

function extensionFromPath(path) {
  const file = path.split('/').pop() || '';
  const dot = file.lastIndexOf('.');
  return dot >= 0 ? file.slice(dot + 1).toLowerCase() : '';
}

function languageFromPath(path) {
  const ext = extensionFromPath(path);
  if (ext === 'md') return 'markdown';
  if (ext === 'html' || ext === 'htm') return 'html';
  if (ext === 'css') return 'css';
  if (ext === 'tsx') return 'typescript';
  if (ext === 'ts') return 'typescript';
  if (ext === 'js') return 'javascript';
  if (ext === 'json') return 'json';
  return 'plaintext';
}

function statusLanguage(path) {
  if (isImagePath(path)) return 'Image';
  const lang = languageFromPath(path);
  if (lang === 'html') return 'HTML';
  if (lang === 'css') return 'CSS';
  if (lang === 'typescript') return 'TypeScript';
  if (lang === 'javascript') return 'JavaScript';
  if (lang === 'markdown') return 'Markdown';
  if (lang === 'json') return 'JSON';
  return 'Plain Text';
}

function iconClassForPath(path) {
  const ext = extensionFromPath(path);
  if (ext === 'md') return 'codicon codicon-markdown';
  if (isImagePath(path)) return 'codicon codicon-file-media';
  if (ext === 'tsx' || ext === 'ts') return 'codicon codicon-symbol-class';
  return 'codicon codicon-file';
}

function isImagePath(path) {
  const ext = extensionFromPath(path);
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext);
}

function mimeFromPath(path) {
  const ext = extensionFromPath(path);
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'svg') return 'image/svg+xml';
  if (ext === 'bmp') return 'image/bmp';
  if (ext === 'ico') return 'image/x-icon';
  return 'application/octet-stream';
}

function buildRepoTree(paths) {
  const root = [];
  const folderMap = new Map();

  function getFolderNode(key, name) {
    if (!folderMap.has(key)) {
      folderMap.set(key, { type: 'folder', name, children: [], repoPath: key });
    }
    return folderMap.get(key);
  }

  paths.forEach((path) => {
    const parts = path.split('/');
    let currentChildren = root;
    let currentKey = '';

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const nextKey = currentKey ? `${currentKey}/${part}` : part;

      if (isFile) {
        currentChildren.push({ type: 'file', name: part, repoPath: nextKey });
      } else {
        let folder = currentChildren.find((node) => node.type === 'folder' && node.name === part);
        if (!folder) {
          folder = getFolderNode(nextKey, part);
          currentChildren.push(folder);
        }
        currentChildren = folder.children;
      }
      currentKey = nextKey;
    });
  });

  function sortTree(nodes) {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => {
      if (node.type === 'folder') sortTree(node.children);
    });
  }

  sortTree(root);
  return root;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function decodeBase64Utf8(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function markdownContextForPath(path) {
  if (path.startsWith('github/')) {
    const repo = path.split('/')[1];
    if (repo) {
      return `${githubUsername}/${repo}`;
    }
  }
  return `${githubUsername}/personal-website`;
}

function TreeNode({ node, depth, expanded, onToggle, onOpen, activePath, parentPath = '' }) {
  const nodePath = parentPath ? `${parentPath}/${node.name}` : node.name;

  if (node.type === 'file') {
    return (
      <li>
        <button
          type="button"
          className={`tree-item file ${activePath === node.path ? 'active' : ''}`}
          style={{ paddingLeft: `${10 + depth * 14}px` }}
          onClick={() => onOpen(node.path)}
        >
          <span className={iconClassForPath(node.path)} aria-hidden="true" />
          {node.name}
        </button>
      </li>
    );
  }

  const isExpanded = expanded.has(nodePath);
  return (
    <li>
      <button
        type="button"
        className="tree-item folder"
        style={{ paddingLeft: `${10 + depth * 14}px` }}
        onClick={() => onToggle(nodePath)}
      >
        <span className={`codicon ${isExpanded ? 'codicon-chevron-down' : 'codicon-chevron-right'}`} />
        <span className="codicon codicon-folder" />
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

function RepoTreeNode({ node, depth, expanded, onToggle, onOpen, activePath, repoName }) {
  if (node.type === 'file') {
    const virtualPath = `github/${repoName}/${node.repoPath}`;
    return (
      <li>
        <button
          type="button"
          className={`tree-item file ${activePath === virtualPath ? 'active' : ''}`}
          style={{ paddingLeft: `${10 + depth * 14}px` }}
          onClick={() => onOpen(node.repoPath)}
        >
          <span className={iconClassForPath(node.repoPath)} aria-hidden="true" />
          {node.name}
        </button>
      </li>
    );
  }

  const folderKey = `repo:${repoName}/${node.repoPath}`;
  const isExpanded = expanded.has(folderKey);
  return (
    <li>
      <button
        type="button"
        className="tree-item folder"
        style={{ paddingLeft: `${10 + depth * 14}px` }}
        onClick={() => onToggle(folderKey)}
      >
        <span className={`codicon ${isExpanded ? 'codicon-chevron-down' : 'codicon-chevron-right'}`} />
        <span className="codicon codicon-folder" />
        {node.name}
      </button>
      {isExpanded && (
        <ul>
          {node.children.map((child) => (
            <RepoTreeNode
              key={`${node.repoPath}/${child.name}`}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onOpen={onOpen}
              activePath={activePath}
              repoName={repoName}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Idea6() {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [activePath, setActivePath] = useState(defaultFile);
  const [openTabs, setOpenTabs] = useState([defaultFile]);
  const [viewMode, setViewMode] = useState('preview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [quickOpenVisible, setQuickOpenVisible] = useState(false);
  const [quickOpenQuery, setQuickOpenQuery] = useState('');
  const [quickOpenIndex, setQuickOpenIndex] = useState(0);
  const [cursorByPath, setCursorByPath] = useState({ [defaultFile]: { line: 1, column: 1 } });
  const [githubRepos, setGithubRepos] = useState([]);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState('');
  const [dynamicFiles, setDynamicFiles] = useState({});
  const [imageFiles, setImageFiles] = useState({});
  const [loadingRepoReadme, setLoadingRepoReadme] = useState({});
  const [loadingRepoTree, setLoadingRepoTree] = useState({});
  const [repoTrees, setRepoTrees] = useState({});
  const [expandedRepos, setExpandedRepos] = useState({});
  const [repoTreeError, setRepoTreeError] = useState({});
  const [renderedMarkdown, setRenderedMarkdown] = useState({});
  const [renderingMarkdown, setRenderingMarkdown] = useState({});

  const allFiles = useMemo(() => ({ ...staticFileContents, ...dynamicFiles }), [dynamicFiles]);
  const allFilePaths = useMemo(
    () => [...new Set([...Object.keys(allFiles), ...Object.keys(imageFiles)])],
    [allFiles, imageFiles]
  );
  const isMarkdown = Boolean(activePath) && activePath.endsWith('.md');
  const isImage = isImagePath(activePath);
  const editorLanguage = languageFromPath(activePath);
  const cursor = cursorByPath[activePath] || { line: 1, column: 1 };

  const quickOpenResults = useMemo(() => {
    const query = quickOpenQuery.trim().toLowerCase();
    if (!query) return allFilePaths;
    return allFilePaths.filter((path) => path.toLowerCase().includes(query));
  }, [quickOpenQuery, allFilePaths]);

  async function openGitHubRepoReadme(repo) {
    const repoPath = `github/${repo.name}/README.md`;
    if (allFiles[repoPath]) {
      openFile(repoPath);
      return;
    }

    setLoadingRepoReadme((current) => ({ ...current, [repo.name]: true }));
    try {
      const response = await fetch(`https://api.github.com/repos/${githubUsername}/${repo.name}/readme`, {
        headers: { Accept: 'application/vnd.github.raw+json' }
      });

      let content;
      if (response.status === 404) {
        content = `# ${repo.name}\n\nREADME not found for this repository.\n\n- Repo: https://github.com/${githubUsername}/${repo.name}\n- Default branch: ${repo.default_branch}\n- Visibility: public`;
      } else if (!response.ok) {
        throw new Error(`GitHub API ${response.status}`);
      } else {
        content = await response.text();
      }

      setDynamicFiles((current) => ({ ...current, [repoPath]: content }));
      openFile(repoPath);
    } catch (error) {
      const fallback = `# ${repo.name}\n\nUnable to load README right now.\n\n- Repo: https://github.com/${githubUsername}/${repo.name}\n- Error: ${error.message}`;
      setDynamicFiles((current) => ({ ...current, [repoPath]: fallback }));
      openFile(repoPath);
    } finally {
      setLoadingRepoReadme((current) => ({ ...current, [repo.name]: false }));
    }
  }

  async function loadGitHubRepoTree(repo) {
    if (repoTrees[repo.name]) return;
    setLoadingRepoTree((current) => ({ ...current, [repo.name]: true }));
    setRepoTreeError((current) => ({ ...current, [repo.name]: '' }));
    try {
      const response = await fetch(
        `https://api.github.com/repos/${githubUsername}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`
      );
      if (!response.ok) {
        throw new Error(`GitHub API ${response.status}`);
      }
      const data = await response.json();
      const filePaths = (data.tree || [])
        .filter((entry) => entry.type === 'blob')
        .map((entry) => entry.path)
        .slice(0, 2000);
      setRepoTrees((current) => ({ ...current, [repo.name]: buildRepoTree(filePaths) }));
    } catch (error) {
      setRepoTreeError((current) => ({
        ...current,
        [repo.name]: `Could not load file tree (${error.message}).`
      }));
    } finally {
      setLoadingRepoTree((current) => ({ ...current, [repo.name]: false }));
    }
  }

  function toggleRepo(repo) {
    const willExpand = !expandedRepos[repo.name];
    setExpandedRepos((current) => ({ ...current, [repo.name]: willExpand }));
    if (willExpand) {
      void loadGitHubRepoTree(repo);
      void openGitHubRepoReadme(repo);
    }
  }

  async function openGitHubRepoFile(repo, repoPath) {
    const virtualPath = `github/${repo.name}/${repoPath}`;
    if (allFiles[virtualPath] || imageFiles[virtualPath]) {
      openFile(virtualPath);
      return;
    }

    try {
      const encodedPath = repoPath
        .split('/')
        .map((part) => encodeURIComponent(part))
        .join('/');
      const response = await fetch(
        `https://api.github.com/repos/${githubUsername}/${repo.name}/contents/${encodedPath}`
      );
      if (!response.ok) {
        throw new Error(`GitHub API ${response.status}`);
      }
      const data = await response.json();
      if (isImagePath(repoPath)) {
        let imageSrc = '';
        if (data.content && data.encoding === 'base64') {
          const base64 = data.content.replace(/\n/g, '');
          imageSrc = `data:${mimeFromPath(repoPath)};base64,${base64}`;
        } else if (data.download_url) {
          const rawResponse = await fetch(data.download_url);
          const blob = await rawResponse.blob();
          imageSrc = URL.createObjectURL(blob);
        } else {
          throw new Error('Unsupported image payload');
        }
        setImageFiles((current) => ({ ...current, [virtualPath]: imageSrc }));
        openFile(virtualPath);
      } else {
        let content = '';
        if (data.content && data.encoding === 'base64') {
          content = decodeBase64Utf8(data.content.replace(/\n/g, ''));
        } else if (data.download_url) {
          const rawResponse = await fetch(data.download_url);
          content = await rawResponse.text();
        } else {
          content = 'Unable to render this file type in browser.';
        }

        setDynamicFiles((current) => ({ ...current, [virtualPath]: content }));
        openFile(virtualPath);
      }
    } catch (error) {
      if (isImagePath(repoPath)) {
        setDynamicFiles((current) => ({
          ...current,
          [virtualPath]: `# ${repoPath}\n\nUnable to load image.\n\n- Repo: https://github.com/${githubUsername}/${repo.name}\n- Error: ${error.message}`
        }));
        openFile(virtualPath);
      } else {
        setDynamicFiles((current) => ({
          ...current,
          [virtualPath]: `# ${repoPath}\n\nUnable to load file.\n\n- Repo: https://github.com/${githubUsername}/${repo.name}\n- Error: ${error.message}`
        }));
        openFile(virtualPath);
      }
    }
  }

  function toggleFolder(path) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function openFile(path) {
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
    setOpenTabs((current) => {
      const next = current.filter((tab) => tab !== path);
      if (path === activePath) {
        const fallback = next[next.length - 1] || '';
        setActivePath(fallback);
      }
      return next;
    });
  }

  function closeAllTabs() {
    setOpenTabs([]);
    setActivePath('');
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

  function commitQuickOpenSelection() {
    const selected = quickOpenResults[quickOpenIndex] || quickOpenResults[0];
    if (!selected) return;
    openFile(selected);
    setQuickOpenVisible(false);
    setQuickOpenQuery('');
    setQuickOpenIndex(0);
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
    setViewMode(isMarkdown ? 'preview' : 'code');
  }, [activePath, isMarkdown]);

  useEffect(() => {
    async function loadRepos() {
      setGithubLoading(true);
      setGithubError('');
      try {
        const response = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`
        );
        if (!response.ok) {
          throw new Error(`GitHub API ${response.status}`);
        }
        const repos = await response.json();
        setGithubRepos(repos.filter((repo) => !repo.fork));
      } catch (error) {
        setGithubError(`Could not load repositories (${error.message}).`);
      } finally {
        setGithubLoading(false);
      }
    }

    loadRepos();
  }, []);

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
  }, [activePath, openTabs]);

  useEffect(() => {
    setQuickOpenIndex(0);
  }, [quickOpenQuery]);

  useEffect(() => {
    const content = allFiles[activePath];
    if (!isMarkdown || viewMode !== 'preview' || !content || renderedMarkdown[activePath]) {
      return;
    }

    let cancelled = false;
    async function renderWithGitHub() {
      setRenderingMarkdown((current) => ({ ...current, [activePath]: true }));
      try {
        const response = await fetch('https://api.github.com/markdown', {
          method: 'POST',
          headers: {
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: content,
            mode: 'gfm',
            context: markdownContextForPath(activePath)
          })
        });

        if (!response.ok) {
          throw new Error(`GitHub markdown API ${response.status}`);
        }

        const html = await response.text();
        if (!cancelled) {
          setRenderedMarkdown((current) => ({ ...current, [activePath]: html }));
        }
      } catch (_error) {
        if (!cancelled) {
          const fallback = `<pre>${escapeHtml(content)}</pre>`;
          setRenderedMarkdown((current) => ({ ...current, [activePath]: fallback }));
        }
      } finally {
        if (!cancelled) {
          setRenderingMarkdown((current) => ({ ...current, [activePath]: false }));
        }
      }
    }

    renderWithGitHub();
    return () => {
      cancelled = true;
    };
  }, [activePath, allFiles, isMarkdown, viewMode, renderedMarkdown]);

  return (
    <main className={`githubdev-page theme-${theme}`}>
      <div className="githubdev-app">
        <header className="gh-topbar">
          <div className="gh-topbar-inner">
            <div className="gh-left">
              <span className="gh-mark" aria-hidden="true">
                GH
              </span>
              <p className="gh-repo">{githubUsername} / personal-website</p>
            </div>
            <button className="gh-command" type="button" onClick={openQuickOpen}>
              Go to file... (Ctrl+P)
            </button>
            <div className="gh-right">
              <div className="theme-switch" role="group" aria-label="Color theme">
                <button
                  type="button"
                  className={theme === 'light' ? 'active' : ''}
                  aria-label="Light mode"
                  aria-pressed={theme === 'light'}
                  onClick={() => setTheme('light')}
                >
                  ☀
                </button>
                <button
                  type="button"
                  className={theme === 'dark' ? 'active' : ''}
                  aria-label="Dark mode"
                  aria-pressed={theme === 'dark'}
                  onClick={() => setTheme('dark')}
                >
                  ☾
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className={`workbench ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <nav className="activity-bar" aria-label="Primary">
            <button
              type="button"
              className={sidebarCollapsed ? '' : 'active'}
              aria-label="Explorer"
              onClick={() => setSidebarCollapsed((current) => !current)}
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

          <aside className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-row">
                <p>OPEN EDITORS</p>
                <button
                  type="button"
                  className="close-all-editors"
                  onClick={closeAllTabs}
                  disabled={!openTabs.length}
                >
                  Close All
                </button>
              </div>
              <ul className="open-editors">
                {openTabs.map((tabPath) => {
                  const name = tabPath.split('/').pop();
                  return (
                    <li key={`open-${tabPath}`}>
                      <div className={`open-editor-row ${activePath === tabPath ? 'active' : ''}`}>
                        <button type="button" className="open-editor-link" onClick={() => selectOpenTab(tabPath)}>
                          <span className={iconClassForPath(tabPath)} />
                          <span className="open-editor-name">{name}</span>
                        </button>
                        <button
                          type="button"
                          className="open-editor-close"
                          aria-label={`Close ${name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            closeTab(tabPath);
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
                    onToggle={toggleFolder}
                    onOpen={openFile}
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
                      <button type="button" onClick={() => toggleRepo(repo)}>
                        <span
                          className={`codicon ${
                            expandedRepos[repo.name] ? 'codicon-chevron-down' : 'codicon-chevron-right'
                          }`}
                        />
                        <span className="codicon codicon-repo" />
                        <span className="repo-name">{repo.name}</span>
                        {(loadingRepoReadme[repo.name] || loadingRepoTree[repo.name]) && (
                          <span className="repo-loading">...</span>
                        )}
                      </button>
                      {expandedRepos[repo.name] && (
                        <>
                          {repoTreeError[repo.name] && (
                            <p className="repo-status error">{repoTreeError[repo.name]}</p>
                          )}
                          <ul className="repo-tree-inline">
                            {(repoTrees[repo.name] || []).map((node) => (
                              <RepoTreeNode
                                key={`${repo.name}/${node.name}`}
                                node={node}
                                depth={1}
                                expanded={expanded}
                                onToggle={toggleFolder}
                                onOpen={(repoPath) => openGitHubRepoFile(repo, repoPath)}
                                activePath={activePath}
                                repoName={repo.name}
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

          <section className="editor-pane">
            <div className="tab-strip">
              {openTabs.map((tabPath) => {
                const tabName = tabPath.split('/').pop();
                const isActive = activePath === tabPath;
                return (
                  <div key={tabPath} className={`tab ${isActive ? 'active' : ''}`}>
                    <button type="button" className="tab-open" onClick={() => selectOpenTab(tabPath)}>
                      <span className={iconClassForPath(tabPath)} />
                      {tabName}
                    </button>
                    <button
                      type="button"
                      className="tab-close"
                      onClick={() => closeTab(tabPath)}
                      aria-label={`Close ${tabName}`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <header className="editor-header">
              <span>{activePath || 'No file selected'}</span>
              {isMarkdown && (
                <div className="md-toggle" role="tablist" aria-label="Markdown view">
                  <button
                    type="button"
                    className={viewMode === 'preview' ? 'active' : ''}
                    onClick={() => setViewMode('preview')}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    className={viewMode === 'code' ? 'active' : ''}
                    onClick={() => setViewMode('code')}
                  >
                    Markdown
                  </button>
                </div>
              )}
            </header>

            <div className={`editor-code ${viewMode === 'preview' ? 'preview-mode' : ''}`}>
              {!activePath ? (
                <div className="empty-editor">Select a file from the explorer to open it.</div>
              ) : isImage && imageFiles[activePath] ? (
                <div className="image-preview">
                  <img src={imageFiles[activePath]} alt={activePath} />
                </div>
              ) : viewMode === 'code' ? (
                <Editor
                  key={`${activePath}-${theme}`}
                  value={allFiles[activePath] || ''}
                  language={editorLanguage}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                  onMount={handleEditorMount}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbersMinChars: 3,
                    scrollBeyondLastLine: false,
                    padding: { top: 12, bottom: 12 }
                  }}
                />
              ) : (
                <div className="markdown-preview">
                  {renderingMarkdown[activePath] ? (
                    <p className="md-loading">Rendering with GitHub Markdown...</p>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{ __html: renderedMarkdown[activePath] || '' }}
                    />
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="status-bar">
          <span>main</span>
          <span>UTF-8</span>
          <span>{statusLanguage(activePath)}</span>
          <span>{`Ln ${cursor.line}, Col ${cursor.column}`}</span>
        </footer>

        {quickOpenVisible && (
          <div className="quick-open-overlay" onClick={() => setQuickOpenVisible(false)}>
            <div className="quick-open" onClick={(event) => event.stopPropagation()}>
              <div className="quick-open-input-wrap">
                <span className="codicon codicon-search" />
                <input
                  autoFocus
                  type="text"
                  value={quickOpenQuery}
                  onChange={(event) => setQuickOpenQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setQuickOpenVisible(false);
                    }
                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      setQuickOpenIndex((current) =>
                        quickOpenResults.length ? (current + 1) % quickOpenResults.length : 0
                      );
                    }
                    if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      setQuickOpenIndex((current) =>
                        quickOpenResults.length
                          ? (current - 1 + quickOpenResults.length) % quickOpenResults.length
                          : 0
                      );
                    }
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commitQuickOpenSelection();
                    }
                  }}
                  placeholder="Type to search files"
                />
              </div>
              <ul>
                {quickOpenResults.map((path, index) => (
                  <li key={path}>
                    <button
                      type="button"
                      className={index === quickOpenIndex ? 'active' : ''}
                      onClick={() => {
                        openFile(path);
                        setQuickOpenVisible(false);
                      }}
                    >
                      <span className={iconClassForPath(path)} />
                      {path}
                    </button>
                  </li>
                ))}
                {!quickOpenResults.length && <li className="empty">No files match.</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
