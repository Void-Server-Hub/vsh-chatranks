import { world } from '@minecraft/server';

const CHAT_COOLDOWN = 3; // Cooldown time in seconds
export const COOLDOWNS = {};

// Clear cooldown when player leaves
world.afterEvents.playerLeave.subscribe(({ playerId }) => {
  delete COOLDOWNS[playerId];
});

// Check if the player can send a message
export function isAbleToSend(playerId) {
  return !(COOLDOWNS[playerId] >= Date.now());
}

// Set the cooldown for the player, with CRSpamSkip tag handling
export function setCooldown(playerId) {
  const player = [...world.getPlayers()].find((p) => p.id === playerId);

  // If the player has the CRSpamSkip tag, set cooldown to 0
  if (player?.hasTag("CRDelaySkip")) {
    COOLDOWNS[playerId] = 0; // Effectively no cooldown
    console.log(`Player ${player.name} has no cooldown due to CRDelaySkip tag.`);
  } else {
    COOLDOWNS[playerId] = Date.now() + CHAT_COOLDOWN * 1000; // Normal cooldown
  }
}

// Handle cooldown logic
export function handleCooldown(playerId) {
  const canSend = isAbleToSend(playerId);
  if (canSend) setCooldown(playerId);
  return canSend;
}

// Get the remaining cooldown in seconds
export function getFormattedCooldown(playerId) {
  const remaining = COOLDOWNS[playerId] - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 100) / 10 : 0;
}
