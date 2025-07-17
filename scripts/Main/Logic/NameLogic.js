import { world } from '@minecraft/server';
import { RANK_PREFIX, DEFAULT_RANK, CREATOR_RANK, GRADIENTS } from "../Configs/Config.js"

function updateNameTags(player) {
    try {
        if (player.hasTag('hideName')) {
            player.nameTag = '';
            return;
        }

        let displayName = player.name;
        const customTag = player.getTags().find(tag => tag.startsWith('customName:'));
        if (customTag) {
            displayName = customTag.split(':')[1];
        }

        let rankPrefix = '';
        const rankTags = player.getTags().filter(tag =>
            RANK_PREFIX.some(prefix => tag.startsWith(prefix))
        );

        if (player.name === "XxVoidicxX" && rankTags.length === 0) {
            rankPrefix = `§r§7[§f${CREATOR_RANK}§r§7]`;
            displayName = `${GRADIENTS.purple}${displayName}§r`;
        } else {
            rankPrefix = rankTags.length > 0
                ? rankTags.map(tag => `§r§7[§f${tag.split(':')[1]}§r§7]`).join(' ')
                : `§r§7[§f${DEFAULT_RANK}§r§7]`;
        }

        let clanTag = '';
        const playerClanTag = player.getTags().find(tag => tag.startsWith('clanTag:'));
        if (playerClanTag) {
            clanTag = `§r§7<§f${playerClanTag.split('clanTag:')[1]}§r§7>`;
        }

        if (player.hasTag("hideNameClan")) {
            clanTag = '';
        }

        if (player.hasTag("hideNameRank")) {
            rankPrefix = '';
        }

        let healthDisplay = '';
        if (player.hasTag('config:health')) {
            const health = Math.round(player.getComponent('health').currentValue * 10) / 10;
            const maxHealth = player.getComponent('health').effectiveMax;
            healthDisplay = `\n§c${health}§4/§c${maxHealth}`;
        }

        player.nameTag =
            `${rankPrefix}${clanTag ? ' ' + clanTag : ''} ${displayName}${healthDisplay}`.trim();
    } catch (error) {
        console.error(`Error updating name tag for player ${player.name}: ${error.message}`);
    }
}

if (!RANK_PREFIX || !DEFAULT_RANK || !CREATOR_RANK || !GRADIENTS) {
    console.error("Config health issue: RANK_PREFIX, DEFAULT_RANK, CREATOR_RANK, or GRADIENT is not defined properly in Config.js");
}

export { updateNameTags };
