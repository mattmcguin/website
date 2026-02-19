export function scoreGame(state) {
  if (!state || typeof state !== 'object') return 0;

  const miles = Number(state.progress?.milesTraveled || 0);
  const alive = Number(state.party?.aliveCount || 0);
  const partySize = Array.isArray(state.party?.members) ? state.party.members.length : Math.max(alive, 0);
  const deaths = Math.max(0, partySize - alive);

  const food = Number(state.resources?.food || 0);
  const ammo = Number(state.resources?.ammo || 0);
  const medicine = Number(state.resources?.medicine || 0);
  const clothing = Number(state.resources?.clothing || 0);
  const money = Number(state.resources?.money || 0);
  const oxen = Number(state.resources?.oxen || 0);
  const wagonHealth = Number(state.resources?.wagonHealth || 0);

  const hardships = Number(state.flags?.hardshipCount || 0);
  const anachronisms = Number(state.flags?.anachronismCount || 0);
  const turns = Number(state.turn?.index || 0);

  const winBonus = state.flags?.won ? 2600 : 0;
  const lossPenalty = state.flags?.lost ? 1250 : 0;

  const rawScore =
    miles * 2.2 +
    alive * 420 +
    food * 0.4 +
    ammo * 0.9 +
    medicine * 22 +
    clothing * 10 +
    money * 0.35 +
    oxen * 120 +
    wagonHealth * 7 +
    hardships * 35 +
    winBonus -
    deaths * 620 -
    anachronisms * 130 -
    turns * 24 -
    lossPenalty;

  return Math.max(0, Math.round(rawScore));
}
