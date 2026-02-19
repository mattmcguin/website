import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import FileIcon from './FileIcon.jsx';

let mermaidRuntimePromise;

async function getMermaidRuntime() {
  if (!mermaidRuntimePromise) {
    mermaidRuntimePromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict'
      });
      return mermaid;
    });
  }
  return mermaidRuntimePromise;
}

export default function EditorPane({
  openTabs,
  activePath,
  onSelectOpenTab,
  onCloseTab,
  isMarkdown,
  isImage,
  imageFiles,
  allFiles,
  editorLanguage,
  theme,
  onEditorMount,
  renderedMarkdown,
  renderingMarkdown,
  customTabContent,
  isTabPinned = () => false
}) {
  const markdownPreviewRef = useRef(null);
  const showMarkdownPreview = Boolean(activePath) && isMarkdown;

  function handleMarkdownLinkClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const link = target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    event.preventDefault();
    window.open(link.href, '_blank', 'noopener,noreferrer');
  }

  useEffect(() => {
    if (!showMarkdownPreview || renderingMarkdown[activePath]) return;

    const container = markdownPreviewRef.current;
    if (!container) return;

    const nodes = Array.from(container.querySelectorAll('.mermaid')).filter(
      (node) => !node.getAttribute('data-mermaid-processed')
    );
    if (!nodes.length) return;

    let cancelled = false;
    async function renderMermaid() {
      try {
        const mermaid = await getMermaidRuntime();
        if (cancelled) return;

        await mermaid.run({ nodes, suppressErrors: true });
        if (!cancelled) {
          nodes.forEach((node) => node.setAttribute('data-mermaid-processed', 'true'));
        }
      } catch (_error) {
        // Keep source text visible if diagram rendering fails.
      }
    }

    renderMermaid();
    return () => {
      cancelled = true;
    };
  }, [showMarkdownPreview, renderingMarkdown, activePath, renderedMarkdown]);

  return (
    <section className="editor-pane">
      <div className="tab-strip">
        {openTabs.map((tabPath) => {
          const tabName = tabPath.split('/').pop();
          const isActive = activePath === tabPath;
          const isPinned = isTabPinned(tabPath);
          return (
            <div key={tabPath} className={`tab ${isActive ? 'active' : ''} ${isPinned ? 'pinned' : ''}`}>
              <button type="button" className="tab-open" onClick={() => onSelectOpenTab(tabPath)}>
                <FileIcon path={tabPath} className="file-icon" />
                {tabName}
              </button>
              {isPinned ? (
                <span className="tab-pin codicon codicon-pinned" aria-hidden="true" />
              ) : (
                <button
                  type="button"
                  className="tab-close"
                  onClick={() => onCloseTab(tabPath)}
                  aria-label={`Close ${tabName}`}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      <header className="editor-header">
        <span>{activePath || 'No file selected'}</span>
      </header>

      <div className={`editor-code ${showMarkdownPreview ? 'preview-mode' : ''}`}>
        {!activePath ? (
          <div className="empty-editor">Select a file from the explorer to open it.</div>
        ) : isImage && imageFiles[activePath] ? (
          <div className="image-preview">
            <img src={imageFiles[activePath]} alt={activePath} />
          </div>
        ) : customTabContent ? (
          <div className="custom-tab-content">{customTabContent}</div>
        ) : !showMarkdownPreview ? (
          <Editor
            key={`${activePath}-${theme}`}
            value={allFiles[activePath] || ''}
            language={editorLanguage}
            theme={theme === 'dark' ? 'vs-dark' : 'vs'}
            onMount={onEditorMount}
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
          <div className="markdown-preview" onClick={handleMarkdownLinkClick} ref={markdownPreviewRef}>
            {renderingMarkdown[activePath] ? (
              <p className="md-loading">Rendering with GitHub Markdown...</p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: renderedMarkdown[activePath] || '' }} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
