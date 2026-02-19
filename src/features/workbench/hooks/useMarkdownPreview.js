import { useEffect, useState } from 'react';
import { markdownContextForPath } from '../utils/fileUtils.js';
import { escapeHtml } from '../utils/textUtils.js';

const MERMAID_RENDERER_VERSION = 'v4';
let markedModulePromise;

async function renderMarkdownLocally(markdown) {
  if (!markedModulePromise) {
    markedModulePromise = import('marked').then(({ marked }) => marked);
  }

  const marked = await markedModulePromise;
  marked.setOptions({
    gfm: true,
    breaks: false
  });

  return marked.parse(markdown);
}

function looksLikeMermaidSource(graph) {
  const firstLine = graph.split('\n').find((line) => line.trim())?.trim() || '';
  return /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|quadrantChart|requirementDiagram|block-beta|kanban|architecture)/i.test(firstLine);
}

function isMermaidCodeBlock(code, pre) {
  const className = code?.className || '';
  const preLang = pre?.getAttribute('lang') || '';
  const preClass = pre?.className || '';
  const ancestorHighlight = pre?.closest('.highlight-source-mermaid, .highlight-source-mermaid .highlight');

  if (/\b(language-mermaid|lang-mermaid|mermaid)\b/i.test(className)) return true;
  if (/\b(language-mermaid|lang-mermaid|mermaid|highlight-source-mermaid)\b/i.test(preClass)) return true;
  if (/^mermaid$/i.test(preLang.trim())) return true;
  if (ancestorHighlight) return true;

  const graph = (code?.textContent || pre?.textContent || '').trim();
  return looksLikeMermaidSource(graph);
}

function withRenderedMermaid(html) {
  if (typeof DOMParser === 'undefined') return html;

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const mermaidCodeBlocks = Array.from(doc.querySelectorAll('pre')).map((pre) => {
    const code = pre.querySelector('code');
    return { pre, code };
  }).filter(({ pre, code }) => isMermaidCodeBlock(code, pre));

  if (!mermaidCodeBlocks.length) return html;

  for (const [index, block] of mermaidCodeBlocks.entries()) {
    const pre = block.pre;
    const graph = (block.code?.textContent || pre.textContent || '').trim();
    if (!pre || !graph) continue;

    const figure = doc.createElement('figure');
    figure.className = 'md-mermaid';
    figure.setAttribute('data-mermaid-index', String(index));

    const container = doc.createElement('div');
    container.className = 'mermaid';
    container.textContent = graph;

    figure.appendChild(container);
    pre.replaceWith(figure);
  }

  return doc.body.innerHTML;
}

export function useMarkdownPreview({ activePath, allFiles, isMarkdown, githubUsername }) {
  const [renderedMarkdown, setRenderedMarkdown] = useState({});
  const [renderedSourceByPath, setRenderedSourceByPath] = useState({});
  const [renderingMarkdown, setRenderingMarkdown] = useState({});

  useEffect(() => {
    const content = allFiles[activePath];
    const renderKey = `${MERMAID_RENDERER_VERSION}:${content}`;
    if (!isMarkdown || !content) {
      return;
    }

    if (renderedSourceByPath[activePath] === renderKey) {
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
          const htmlWithMermaid = withRenderedMermaid(html);
          if (!cancelled) {
            setRenderedMarkdown((current) => ({ ...current, [activePath]: htmlWithMermaid }));
            setRenderedSourceByPath((current) => ({ ...current, [activePath]: renderKey }));
          }
        }
      } catch (_error) {
        if (!cancelled) {
          try {
            const fallbackHtml = await renderMarkdownLocally(content);
            const fallbackWithMermaid = withRenderedMermaid(fallbackHtml);
            if (!cancelled) {
              setRenderedMarkdown((current) => ({ ...current, [activePath]: fallbackWithMermaid }));
              setRenderedSourceByPath((current) => ({ ...current, [activePath]: renderKey }));
            }
          } catch (_fallbackError) {
            const fallback = `<pre>${escapeHtml(content)}</pre>`;
            setRenderedMarkdown((current) => ({ ...current, [activePath]: fallback }));
            setRenderedSourceByPath((current) => ({ ...current, [activePath]: renderKey }));
          }
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
  }, [activePath, allFiles, githubUsername, isMarkdown, renderedSourceByPath]);

  return { renderedMarkdown, renderingMarkdown };
}
