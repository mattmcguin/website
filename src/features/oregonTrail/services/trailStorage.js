const ACTIVE_RUN_KEY = 'oregonTrail:activeRun:v1';
const LEADERBOARD_KEY = 'oregonTrail:leaderboard:v1';
const SETTINGS_KEY = 'oregonTrail:settings:v1';

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function sortLeaderboard(entries) {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Date.parse(b.endedAt || 0) - Date.parse(a.endedAt || 0);
  });
}

export function loadActiveRun() {
  const parsed = readJson(ACTIVE_RUN_KEY, null);
  if (!parsed || typeof parsed !== 'object') return null;
  return parsed;
}

export function saveActiveRun(payload) {
  const hasProgress = Boolean(payload?.state) || (payload?.transcript || []).length > 0;
  if (!hasProgress) {
    clearActiveRun();
    return;
  }

  writeJson(ACTIVE_RUN_KEY, {
    state: payload.state || null,
    transcript: Array.isArray(payload.transcript) ? payload.transcript : [],
    awaitingName: Boolean(payload.awaitingName),
    scoreSaved: Boolean(payload.scoreSaved),
    savedAt: new Date().toISOString()
  });
}

export function clearActiveRun() {
  try {
    window.localStorage.removeItem(ACTIVE_RUN_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function loadLeaderboard() {
  const parsed = readJson(LEADERBOARD_KEY, []);
  if (!Array.isArray(parsed)) return [];

  const normalized = parsed
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      id: String(entry.id || ''),
      name: String(entry.name || 'Anonymous Pioneer'),
      score: Number.isFinite(Number(entry.score)) ? Number(entry.score) : 0,
      won: Boolean(entry.won),
      milesTraveled: Number.isFinite(Number(entry.milesTraveled)) ? Number(entry.milesTraveled) : 0,
      turns: Number.isFinite(Number(entry.turns)) ? Number(entry.turns) : 0,
      endedAt: String(entry.endedAt || new Date(0).toISOString()),
      lossReason: String(entry.lossReason || '')
    }));

  return sortLeaderboard(normalized).slice(0, 100);
}

export function saveLeaderboard(entries) {
  const sorted = sortLeaderboard(Array.isArray(entries) ? entries : []).slice(0, 100);
  writeJson(LEADERBOARD_KEY, sorted);
  return sorted;
}

export function addLeaderboardEntry(entry) {
  const current = loadLeaderboard();
  const next = saveLeaderboard([...current, entry]);
  return next;
}

export function loadTrailSettings() {
  const parsed = readJson(SETTINGS_KEY, {});
  if (!parsed || typeof parsed !== 'object') return {};
  return parsed;
}

export function saveTrailSettings(settings) {
  writeJson(SETTINGS_KEY, settings && typeof settings === 'object' ? settings : {});
}

export function sanitizePlayerName(input) {
  const collapsed = String(input || '').trim().replace(/\s+/g, ' ');
  const cleaned = collapsed.replace(/[^A-Za-z0-9 '\-]/g, '').slice(0, 24).trim();
  if (!cleaned) return 'Anonymous Pioneer';
  return cleaned;
}

export const trailStorageKeys = {
  activeRun: ACTIVE_RUN_KEY,
  leaderboard: LEADERBOARD_KEY,
  settings: SETTINGS_KEY
};
