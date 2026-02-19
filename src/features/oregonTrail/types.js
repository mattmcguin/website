export const TOTAL_TRAIL_MILES = 2040;

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
}

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asIsoDate(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return fallback;
  return new Date(parsed).toISOString();
}

export function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `trail-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createDefaultTrailState(sessionId = createSessionId()) {
  const now = new Date().toISOString();
  return {
    sessionId,
    createdAt: now,
    updatedAt: now,
    calendar: {
      dateIso: '1848-04-01T12:00:00.000Z',
      season: 'spring'
    },
    progress: {
      milesTraveled: 0,
      milesRemaining: TOTAL_TRAIL_MILES,
      landmark: 'Independence, Missouri'
    },
    party: {
      members: [
        { name: 'Party Leader', health: 100, status: 'healthy' },
        { name: 'Scout', health: 100, status: 'healthy' },
        { name: 'Wagon Cook', health: 100, status: 'healthy' },
        { name: 'Navigator', health: 100, status: 'healthy' },
        { name: 'Blacksmith', health: 100, status: 'healthy' }
      ],
      aliveCount: 5
    },
    resources: {
      food: 200,
      ammo: 80,
      medicine: 20,
      clothing: 20,
      money: 400,
      oxen: 4,
      wagonHealth: 100
    },
    conditions: {
      weather: 'clear',
      terrain: 'plains',
      trailRisk: 'moderate'
    },
    flags: {
      won: false,
      lost: false,
      lossReason: '',
      hardshipCount: 0,
      anachronismCount: 0
    },
    turn: {
      index: 0,
      lastCommand: '',
      lastOutcomeSummary: 'Your party assembles at Independence.'
    }
  };
}

function normalizeMembers(value, fallbackMembers) {
  const source = Array.isArray(value) ? value : fallbackMembers;
  const members = source
    .map((member, index) => {
      if (!member || typeof member !== 'object') return null;
      const status = asString(member.status, 'unknown').toLowerCase();
      const health = clampNumber(member.health, 0, 100, 100);
      const defaultName = fallbackMembers[index]?.name || `Member ${index + 1}`;
      return {
        name: asString(member.name, defaultName).slice(0, 32),
        health,
        status
      };
    })
    .filter(Boolean);

  return members.length ? members : fallbackMembers;
}

function normalizeAliveCount(members, candidate, fallback) {
  const livingByStatus = members.filter((member) => !/(dead|deceased)/i.test(member.status)).length;
  const candidateValue = clampNumber(candidate, 0, members.length, livingByStatus);
  if (candidateValue > members.length) return members.length;
  if (candidateValue < 0) return fallback;
  return candidateValue;
}

export function normalizeTrailState(candidate, previousState = createDefaultTrailState()) {
  if (!candidate || typeof candidate !== 'object') return null;

  const now = new Date().toISOString();
  const fallback = previousState && typeof previousState === 'object'
    ? previousState
    : createDefaultTrailState();

  const members = normalizeMembers(candidate.party?.members, fallback.party.members);
  const milesTraveled = clampNumber(candidate.progress?.milesTraveled, 0, TOTAL_TRAIL_MILES, fallback.progress.milesTraveled);
  const milesRemaining = clampNumber(
    candidate.progress?.milesRemaining,
    0,
    TOTAL_TRAIL_MILES,
    Math.max(0, TOTAL_TRAIL_MILES - milesTraveled)
  );

  const normalized = {
    sessionId: asString(candidate.sessionId, fallback.sessionId || createSessionId()),
    createdAt: asIsoDate(candidate.createdAt, fallback.createdAt || now),
    updatedAt: asIsoDate(candidate.updatedAt, now),
    calendar: {
      dateIso: asIsoDate(candidate.calendar?.dateIso, fallback.calendar.dateIso),
      season: asString(candidate.calendar?.season, fallback.calendar.season || 'unknown').toLowerCase()
    },
    progress: {
      milesTraveled,
      milesRemaining,
      landmark: asString(candidate.progress?.landmark, fallback.progress.landmark).slice(0, 96)
    },
    party: {
      members,
      aliveCount: normalizeAliveCount(members, candidate.party?.aliveCount, fallback.party.aliveCount)
    },
    resources: {
      food: clampNumber(candidate.resources?.food, 0, 5000, fallback.resources.food),
      ammo: clampNumber(candidate.resources?.ammo, 0, 2000, fallback.resources.ammo),
      medicine: clampNumber(candidate.resources?.medicine, 0, 500, fallback.resources.medicine),
      clothing: clampNumber(candidate.resources?.clothing, 0, 500, fallback.resources.clothing),
      money: clampNumber(candidate.resources?.money, 0, 100000, fallback.resources.money),
      oxen: clampNumber(candidate.resources?.oxen, 0, 32, fallback.resources.oxen),
      wagonHealth: clampNumber(candidate.resources?.wagonHealth, 0, 100, fallback.resources.wagonHealth)
    },
    conditions: {
      weather: asString(candidate.conditions?.weather, fallback.conditions.weather).slice(0, 64),
      terrain: asString(candidate.conditions?.terrain, fallback.conditions.terrain).slice(0, 64),
      trailRisk: asString(candidate.conditions?.trailRisk, fallback.conditions.trailRisk).slice(0, 32)
    },
    flags: {
      won: Boolean(candidate.flags?.won),
      lost: Boolean(candidate.flags?.lost),
      lossReason: asString(candidate.flags?.lossReason, fallback.flags.lossReason).slice(0, 240),
      hardshipCount: clampNumber(candidate.flags?.hardshipCount, 0, 10000, fallback.flags.hardshipCount),
      anachronismCount: clampNumber(
        candidate.flags?.anachronismCount,
        0,
        10000,
        fallback.flags.anachronismCount
      )
    },
    turn: {
      index: clampNumber(candidate.turn?.index, 0, 10000, fallback.turn.index),
      lastCommand: asString(candidate.turn?.lastCommand, fallback.turn.lastCommand).slice(0, 320),
      lastOutcomeSummary: asString(candidate.turn?.lastOutcomeSummary, fallback.turn.lastOutcomeSummary).slice(0, 600)
    }
  };

  if (normalized.flags.won && normalized.flags.lost) {
    normalized.flags.lost = false;
  }

  return normalized;
}

export function isTrailGameOver(state) {
  return Boolean(state?.flags?.won || state?.flags?.lost);
}

export function stripStateBlock(text = '') {
  return text
    .replace(/<STATE>[\s\S]*?<\/STATE>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
