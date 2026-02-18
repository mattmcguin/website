import { useEffect, useState } from 'react';
import { markdownContextForPath } from '../utils/fileUtils.js';
import { escapeHtml } from '../utils/textUtils.js';

export function useMarkdownPreview({ activePath, allFiles, isMarkdown, viewMode, githubUsername }) {
  const [renderedMarkdown, setRenderedMarkdown] = useState({});
  const [renderingMarkdown, setRenderingMarkdown] = useState({});

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
            context: markdownContextForPath(activePath, githubUsername)
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
  }, [activePath, allFiles, githubUsername, isMarkdown, renderedMarkdown, viewMode]);

  return { renderedMarkdown, renderingMarkdown };
}
