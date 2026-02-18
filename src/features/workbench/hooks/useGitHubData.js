import { useEffect, useState } from 'react';
import { isImagePath, mimeFromPath } from '../utils/fileUtils.js';
import { decodeBase64Utf8 } from '../utils/textUtils.js';
import { buildRepoTree } from '../utils/treeUtils.js';

const REPO_CACHE_MAX_AGE_MS = 30 * 60 * 1000;
const TREE_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function getCache(key, maxAgeMs) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.savedAt !== 'number') return null;
    if (Date.now() - parsed.savedAt > maxAgeMs) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        savedAt: Date.now(),
        data
      })
    );
  } catch {
    // Ignore storage quota/private mode errors and continue without caching.
  }
}

async function buildGitHubError(response) {
  let message = `GitHub API ${response.status}`;
  try {
    const payload = await response.json();
    if (payload?.message) message = payload.message;
  } catch {
    // Ignore parse failures and keep fallback message.
  }

  const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
  const rateLimitReset = Number(response.headers.get('x-ratelimit-reset'));
  if (response.status === 403 && rateLimitRemaining === '0') {
    const resetAt = Number.isFinite(rateLimitReset)
      ? new Date(rateLimitReset * 1000).toLocaleString()
      : 'later';
    return `GitHub API rate limit exceeded. Try again after ${resetAt}.`;
  }

  return message;
}

export function useGitHubData({ githubUsername, openFile }) {
  const [githubRepos, setGithubRepos] = useState([]);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState('');
  const [dynamicFiles, setDynamicFiles] = useState({});
  const [imageFileMap, setImageFileMap] = useState({});
  const [loadingRepoTree, setLoadingRepoTree] = useState({});
  const [repoTrees, setRepoTrees] = useState({});
  const [expandedRepos, setExpandedRepos] = useState({});
  const [repoTreeError, setRepoTreeError] = useState({});
  const githubToken = import.meta.env.VITE_GITHUB_TOKEN?.trim();

  async function githubFetch(url, init = {}, options = {}) {
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {})
    };

    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`;
    }

    const response = await fetch(url, { ...init, headers });
    if (!response.ok && !(options.allowNotFound && response.status === 404)) {
      throw new Error(await buildGitHubError(response));
    }
    return response;
  }

  useEffect(() => {
    async function loadRepos() {
      const repoCacheKey = `github:repos:${githubUsername}`;
      const cachedRepos = getCache(repoCacheKey, REPO_CACHE_MAX_AGE_MS);
      if (cachedRepos) {
        setGithubRepos(cachedRepos);
      }

      setGithubLoading(true);
      setGithubError('');
      try {
        const response = await githubFetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`
        );
        const repos = await response.json();
        const nonForkRepos = repos.filter((repo) => !repo.fork);
        setGithubRepos(nonForkRepos);
        setCache(repoCacheKey, nonForkRepos);
      } catch (error) {
        if (cachedRepos) {
          setGithubError(`Live GitHub sync failed (${error.message}). Showing cached repositories.`);
        } else {
          setGithubError(`Could not load repositories (${error.message}).`);
        }
      } finally {
        setGithubLoading(false);
      }
    }

    loadRepos();
  }, [githubUsername]);

  async function loadGitHubRepoTree(repo) {
    if (repoTrees[repo.name]) return;

    const repoTreeCacheKey = `github:tree:${githubUsername}/${repo.name}`;
    const cachedRepoTree = getCache(repoTreeCacheKey, TREE_CACHE_MAX_AGE_MS);
    if (cachedRepoTree) {
      setRepoTrees((current) => ({ ...current, [repo.name]: cachedRepoTree }));
      return;
    }

    setLoadingRepoTree((current) => ({ ...current, [repo.name]: true }));
    setRepoTreeError((current) => ({ ...current, [repo.name]: '' }));
    try {
      const response = await githubFetch(
        `https://api.github.com/repos/${githubUsername}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`
      );

      const data = await response.json();
      const filePaths = (data.tree || [])
        .filter((entry) => entry.type === 'blob')
        .map((entry) => entry.path)
        .slice(0, 2000);
      const builtTree = buildRepoTree(filePaths);
      setRepoTrees((current) => ({ ...current, [repo.name]: builtTree }));
      setCache(repoTreeCacheKey, builtTree);
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
      const response = await githubFetch(
        `https://api.github.com/repos/${githubUsername}/${repo.name}/contents/${encodedPath}`
      );

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
    loadingRepoTree,
    repoTrees,
    expandedRepos,
    repoTreeError,
    toggleRepo,
    openGitHubRepoFile
  };
}
