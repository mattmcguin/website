export default function SimpleMarkdownView({
  filePath,
  renderedMarkdown,
  renderingMarkdown,
  onBack,
  onOpenDeveloperMode
}) {
  return (
    <section className="simple-markdown-view">
      <header className="simple-markdown-toolbar">
        <button type="button" className="simple-back-button" onClick={onBack}>
          <span className="codicon codicon-arrow-left" aria-hidden="true" />
          Back
        </button>
        <span className="simple-markdown-path">{filePath}</span>
        {typeof onOpenDeveloperMode === 'function' ? (
          <button
            type="button"
            className="simple-dev-toggle simple-dev-toggle-inline"
            onClick={onOpenDeveloperMode}
          >
            Developer Mode
          </button>
        ) : null}
      </header>

      <div className="markdown-preview">
        <div className="markdown-preview-body">
          {renderingMarkdown[filePath] ? (
            <p className="md-loading">Rendering markdown preview...</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: renderedMarkdown[filePath] || '' }} />
          )}
        </div>
      </div>
    </section>
  );
}
