import { world } from '@minecraft/server';

const CHAT_COOLDOWN = 3;
export const COOLDOWNS = {};

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
  delete COOLDOWNS[playerId];
});

export function isAbleToSend(playerId) {
  return !(COOLDOWNS[playerId] >= Date.now());
}

export function setCooldown(playerId) {
  const player = [...world.getPlayers()].find((p) => p.id === playerId);

  if (player?.hasTag("CRDelaySkip")) {
    COOLDOWNS[playerId] = 0;
    console.log(`Player ${player.name} has no cooldown due to CRDelaySkip tag.`);
  } else {
    COOLDOWNS[playerId] = Date.now() + CHAT_COOLDOWN * 1000;
  }
}

export function handleCooldown(playerId) {
  const canSend = isAbleToSend(playerId);
  if (canSend) setCooldown(playerId);
  return canSend;
}

export function getFormattedCooldown(playerId) {
  const remaining = COOLDOWNS[playerId] - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 100) / 10 : 0;
}
