const simplePathByFilePath = {
  'work/perch.app': '/work/perch.app',
  'personal/joinperch.com': '/work/joinperch.com',
  'work/gm.xyz': '/work/gm.xyz'
};

const filePathBySimpleSlug = {
  'perch.app': 'work/perch.app',
  'joinperch.com': 'personal/joinperch.com',
  'gm.xyz': 'work/gm.xyz'
};

export function simplePathFromFile(filePath) {
  return simplePathByFilePath[filePath] || '/';
}

export function filePathFromSimpleSlug(slug) {
  if (!slug) return null;
  return filePathBySimpleSlug[slug] || null;
}
