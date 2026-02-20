import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import SimpleMarkdownView from '../features/workbench/components/SimpleMarkdownView.jsx';
import WelcomeTab from '../features/workbench/components/WelcomeTab.jsx';
import {
  githubUsername,
  staticFileContents
} from '../features/workbench/constants/workbenchData.js';
import { useMarkdownPreview } from '../features/workbench/hooks/useMarkdownPreview.js';
import { isMarkdownPath } from '../features/workbench/utils/fileUtils.js';
import {
  filePathFromSimpleSlug,
  simplePathFromFile
} from '../features/workbench/utils/navigationMap.js';

export default function SimplePage({ onEnterDeveloperMode }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const filePath = useMemo(() => {
    if (!slug) return null;
    return filePathFromSimpleSlug(slug);
  }, [slug]);
  const invalidSlug = Boolean(slug && !filePath);

  const isMarkdown = Boolean(filePath) && isMarkdownPath(filePath);
  const { renderedMarkdown, renderingMarkdown } = useMarkdownPreview({
    activePath: filePath || '',
    allFiles: staticFileContents,
    isMarkdown,
    githubUsername
  });

  if (invalidSlug) {
    return <Navigate to="/" replace />;
  }

  function handleOpenFile(path) {
    navigate(simplePathFromFile(path));
  }

  function handleOpenDeveloperMode() {
    if (typeof onEnterDeveloperMode === 'function') {
      onEnterDeveloperMode();
    }
  }

  function handleBack() {
    const historyIndex = window.history.state?.idx;
    const canGoBack = typeof historyIndex === 'number'
      ? historyIndex > 0
      : window.history.length > 1;

    if (canGoBack) {
      navigate(-1);
      return;
    }

    navigate('/');
  }

  return (
    <main className="githubdev-page theme-light simple-page">
      <div className="simple-page-shell">
        <div className="simple-page-content">
          {filePath ? (
            <SimpleMarkdownView
              filePath={filePath}
              renderedMarkdown={renderedMarkdown}
              renderingMarkdown={renderingMarkdown}
              onBack={handleBack}
              onOpenDeveloperMode={handleOpenDeveloperMode}
            />
          ) : (
            <WelcomeTab
              onOpenFile={handleOpenFile}
              introAction={(
                <button type="button" className="simple-dev-toggle" onClick={handleOpenDeveloperMode}>
                  Developer Mode
                </button>
              )}
            />
          )}
        </div>
      </div>
    </main>
  );
}
