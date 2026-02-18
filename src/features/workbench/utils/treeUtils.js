export function buildRepoTree(paths) {
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
