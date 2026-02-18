import { useEffect, useState } from 'react';
import { isImagePath, mimeFromPath } from '../utils/fileUtils.js';
import { decodeBase64Utf8 } from '../utils/textUtils.js';
import { buildRepoTree } from '../utils/treeUtils.js';

export function useGitHubData({ githubUsername, openFile }) {
  const [githubRepos, setGithubRepos] = useState([]);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState('');
  const [dynamicFiles, setDynamicFiles] = useState({});
  const [imageFileMap, setImageFileMap] = useState({});
  const [loadingRepoReadme, setLoadingRepoReadme] = useState({});
  const [loadingRepoTree, setLoadingRepoTree] = useState({});
  const [repoTrees, setRepoTrees] = useState({});
  const [expandedRepos, setExpandedRepos] = useState({});
  const [repoTreeError, setRepoTreeError] = useState({});

  useEffect(() => {
    async function loadRepos() {
      setGithubLoading(true);
      setGithubError('');
      try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`);
        if (!response.ok) {
          throw new Error(`GitHub API ${response.status}`);
        }
        const repos = await response.json();
        setGithubRepos(repos.filter((repo) => !repo.fork));
      } catch (error) {
        setGithubError(`Could not load repositories (${error.message}).`);
      } finally {
        setGithubLoading(false);
      }
    }

    loadRepos();
  }, [githubUsername]);

  async function openGitHubRepoReadme(repo) {
    const repoPath = `github/${repo.name}/README.md`;
    if (dynamicFiles[repoPath]) {
      openFile(repoPath);
      return;
    }

    setLoadingRepoReadme((current) => ({ ...current, [repo.name]: true }));
    try {
      const response = await fetch(`https://api.github.com/repos/${githubUsername}/${repo.name}/readme`, {
        headers: { Accept: 'application/vnd.github.raw+json' }
      });

      let content;
      if (response.status === 404) {
        content = `# ${repo.name}\n\nREADME not found for this repository.\n\n- Repo: https://github.com/${githubUsername}/${repo.name}\n- Default branch: ${repo.default_branch}\n- Visibility: public`;
      } else if (!response.ok) {
        throw new Error(`GitHub API ${response.status}`);
      } else {
        content = await response.text();
      }

      setDynamicFiles((current) => ({ ...current, [repoPath]: content }));
      openFile(repoPath);
    } catch (error) {
      const fallback = `# ${repo.name}\n\nUnable to load README right now.\n\n- Repo: https://github.com/${githubUsername}/${repo.name}\n- Error: ${error.message}`;
      setDynamicFiles((current) => ({ ...current, [repoPath]: fallback }));
      openFile(repoPath);
    } finally {
      setLoadingRepoReadme((current) => ({ ...current, [repo.name]: false }));
    }
  }

  async function loadGitHubRepoTree(repo) {
    if (repoTrees[repo.name]) return;

    setLoadingRepoTree((current) => ({ ...current, [repo.name]: true }));
    setRepoTreeError((current) => ({ ...current, [repo.name]: '' }));
    try {
      const response = await fetch(
        `https://api.github.com/repos/${githubUsername}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`
      );
      if (!response.ok) {
        throw new Error(`GitHub API ${response.status}`);
      }

      const data = await response.json();
      const filePaths = (data.tree || [])
        .filter((entry) => entry.type === 'blob')
        .map((entry) => entry.path)
        .slice(0, 2000);
      setRepoTrees((current) => ({ ...current, [repo.name]: buildRepoTree(filePaths) }));
    } catch (error) {
      setRepoTreeError((current) => ({
        ...current,
        [repo.name]: `Could not load file tree (${error.message}).`
      }));
    } finally {
      setLoadingRepoTree((current) => ({ ...current, [repo.name]: false }));
    }
  }

  function toggleRepo(repo) {
    const willExpand = !expandedRepos[repo.name];
    setExpandedRepos((current) => ({ ...current, [repo.name]: willExpand }));
    if (willExpand) {
      void loadGitHubRepoTree(repo);
      void openGitHubRepoReadme(repo);
    }
  }

  async function openGitHubRepoFile(repo, repoPath) {
    const virtualPath = `github/${repo.name}/${repoPath}`;
    if (dynamicFiles[virtualPath] || imageFileMap[virtualPath]) {
      openFile(virtualPath);
      return;
    }

    try {
      const encodedPath = repoPath
        .split('/')
        .map((part) => encodeURIComponent(part))
        .join('/');
      const response = await fetch(`https://api.github.com/repos/${githubUsername}/${repo.name}/contents/${encodedPath}`);
      if (!response.ok) {
        throw new Error(`GitHub API ${response.status}`);
      }

      const data = await response.json();
      if (isImagePath(repoPath)) {
        let imageSrc = '';
        if (data.content && data.encoding === 'base64') {
          const base64 = data.content.replace(/\n/g, '');
          imageSrc = `data:${mimeFromPath(repoPath)};base64,${base64}`;
        } else if (data.download_url) {
          const rawResponse = await fetch(data.download_url);
          const blob = await rawResponse.blob();
          imageSrc = URL.createObjectURL(blob);
        } else {
          throw new Error('Unsupported image payload');
        }
        setImageFileMap((current) => ({ ...current, [virtualPath]: imageSrc }));
        openFile(virtualPath);
      } else {
        let content = '';
        if (data.content && data.encoding === 'base64') {
          content = decodeBase64Utf8(data.content.replace(/\n/g, ''));
        } else if (data.download_url) {
          const rawResponse = await fetch(data.download_url);
          content = await rawResponse.text();
        } else {
          content = 'Unable to render this file type in browser.';
        }

        setDynamicFiles((current) => ({ ...current, [virtualPath]: content }));
        openFile(virtualPath);
      }
    } catch (error) {
      const fallback = isImagePath(repoPath)
        ? `# ${repoPath}\n\nUnable to load image.\n\n- Repo: https://github.com/${githubUsername}/${repo.name}\n- Error: ${error.message}`
        : `# ${repoPath}\n\nUnable to load file.\n\n- Repo: https://github.com/${githubUsername}/${repo.name}\n- Error: ${error.message}`;
      setDynamicFiles((current) => ({ ...current, [virtualPath]: fallback }));
      openFile(virtualPath);
    }
  }

  return {
    githubRepos,
    githubLoading,
    githubError,
    dynamicFiles,
    imageFileMap,
    loadingRepoReadme,
    loadingRepoTree,
    repoTrees,
    expandedRepos,
    repoTreeError,
    toggleRepo,
    openGitHubRepoFile
  };
}
