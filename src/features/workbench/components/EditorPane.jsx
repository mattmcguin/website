import Editor from '@monaco-editor/react';
import { iconClassForPath } from '../utils/fileUtils.js';

export default function EditorPane({
  openTabs,
  activePath,
  onSelectOpenTab,
  onCloseTab,
  isMarkdown,
  viewMode,
  onSetViewMode,
  isImage,
  imageFiles,
  allFiles,
  editorLanguage,
  theme,
  onEditorMount,
  renderedMarkdown,
  renderingMarkdown
}) {
  return (
    <section className="editor-pane">
      <div className="tab-strip">
        {openTabs.map((tabPath) => {
          const tabName = tabPath.split('/').pop();
          const isActive = activePath === tabPath;
          return (
            <div key={tabPath} className={`tab ${isActive ? 'active' : ''}`}>
              <button type="button" className="tab-open" onClick={() => onSelectOpenTab(tabPath)}>
                <span className={iconClassForPath(tabPath)} />
                {tabName}
              </button>
              <button type="button" className="tab-close" onClick={() => onCloseTab(tabPath)} aria-label={`Close ${tabName}`}>
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
            <button type="button" className={viewMode === 'preview' ? 'active' : ''} onClick={() => onSetViewMode('preview')}>
              Preview
            </button>
            <button type="button" className={viewMode === 'code' ? 'active' : ''} onClick={() => onSetViewMode('code')}>
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
          <div className="markdown-preview">
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
