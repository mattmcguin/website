export function extensionFromPath(path) {
  const file = path.split('/').pop() || '';
  const dot = file.lastIndexOf('.');
  return dot >= 0 ? file.slice(dot + 1).toLowerCase() : '';
}

export function languageFromPath(path) {
  const ext = extensionFromPath(path);
  if (ext === 'md') return 'markdown';
  if (ext === 'html' || ext === 'htm') return 'html';
  if (ext === 'css') return 'css';
  if (ext === 'tsx' || ext === 'ts') return 'typescript';
  if (ext === 'jsx' || ext === 'js') return 'javascript';
  if (ext === 'java') return 'java';
  if (['cpp', 'cxx', 'cc', 'hpp', 'hxx', 'hh'].includes(ext)) return 'cpp';
  if (ext === 'json') return 'json';
  return 'plaintext';
}

export function isImagePath(path) {
  const ext = extensionFromPath(path);
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext);
}

export function statusLanguage(path) {
  if (isImagePath(path)) return 'Image';

  const lang = languageFromPath(path);
  if (lang === 'html') return 'HTML';
  if (lang === 'css') return 'CSS';
  if (lang === 'typescript') return 'TypeScript';
  if (lang === 'javascript') return 'JavaScript';
  if (lang === 'java') return 'Java';
  if (lang === 'cpp') return 'C++';
  if (lang === 'markdown') return 'Markdown';
  if (lang === 'json') return 'JSON';
  return 'Plain Text';
}

export function iconClassForPath(path) {
  if (path === 'START_HERE.jsx') return 'codicon codicon-book';
  const ext = extensionFromPath(path);
  if (ext === 'md') return 'codicon codicon-markdown';
  if (isImagePath(path)) return 'codicon codicon-file-media';
  if (ext === 'tsx' || ext === 'ts' || ext === 'jsx') return 'codicon codicon-symbol-class';
  return 'codicon codicon-file';
}

export function mimeFromPath(path) {
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

export function markdownContextForPath(path, username) {
  if (path.startsWith('github/')) {
    const repo = path.split('/')[1];
    if (repo) {
      return `${username}/${repo}`;
    }
  }
  return `${username}/personal-website`;
}
