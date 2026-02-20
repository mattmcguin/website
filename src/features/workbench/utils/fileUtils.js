export function extensionFromPath(path) {
  const file = path.split('/').pop() || '';
  const dot = file.lastIndexOf('.');
  return dot >= 0 ? file.slice(dot + 1).toLowerCase() : '';
}

const customFileIconByPath = {
  'work/perch.app': 'https://prod.r2-perch.com/Avatar-03.png',
  'work/joinperch.com': '/images/work/joinperch.com.png',
  'work/gm.xyz': 'https://prod.r2-perch.com/media/gm.xyz.png'
};

export function iconImageForPath(path) {
  return customFileIconByPath[path] || '';
}

export function isMarkdownPath(path) {
  if (!path) return false;
  const ext = extensionFromPath(path);
  if (['md', 'mdx', 'rst', 'txt'].includes(ext)) return true;
  if (path.startsWith('work/')) return true;
  return false;
}

export function languageFromPath(path) {
  if (isMarkdownPath(path)) return 'markdown';

  const ext = extensionFromPath(path);
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
  const file = (path.split('/').pop() || '').toLowerCase();
  const ext = extensionFromPath(path);

  if (path === 'Welcome') return 'codicon codicon-vscode';
  if (file === 'readme' || file === 'readme.md') return 'codicon codicon-book';
  if (file === 'license' || file === 'license.md') return 'codicon codicon-note';

  if (isImagePath(path)) return 'codicon codicon-file-media';
  if (isMarkdownPath(path)) return 'codicon codicon-markdown';

  if (ext === 'pdf') return 'codicon codicon-file-pdf';
  if (['zip', 'gz', 'tgz', 'bz2', 'xz', '7z', 'rar', 'tar'].includes(ext)) return 'codicon codicon-file-zip';
  if (['lock', 'bin', 'exe'].includes(ext)) return 'codicon codicon-file-binary';

  if (['json', 'jsonc', 'yaml', 'yml', 'toml', 'xml', 'ini', 'conf', 'config', 'env', 'properties'].includes(ext)) {
    return 'codicon codicon-json';
  }

  if (
    [
      'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs',
      'py', 'java',
      'cpp', 'cxx', 'cc', 'hpp', 'hxx', 'hh', 'c', 'h',
      'cs', 'go', 'rs', 'rb', 'php', 'swift',
      'kt', 'kts', 'scala', 'dart', 'lua', 'pl',
      'sh', 'bash', 'zsh', 'fish', 'ps1',
      'sql', 'r', 'vue', 'svelte',
      'html', 'htm', 'css', 'scss', 'sass', 'less'
    ].includes(ext)
  ) {
    return 'codicon codicon-file-code';
  }

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
