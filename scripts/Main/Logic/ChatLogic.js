import { getColor, getConfig } from './NameMessageLogic/NameMessageLogic.js';
import { getRank } from './RankLogic.js';
import { NAMETAG_COLOR_PREFIX, CHAT_COLOR_PREFIX, CREATOR_RANK, RANK_JOIN } from '../Configs/Config.js';
import { ItemStack } from '@minecraft/server';

export function processChatMessage(player, message, displayName, clanTag) {
    const container = player.getComponent('inventory')?.container;
    const itemReqTags = player.getTags().filter(tag => tag.startsWith('chatItemRequire:'));

    if (itemReqTags.length > 0) {
        const missingItems = [];
        for (const tag of itemReqTags) {
            const requiredItem = tag.split(':')[1];
            if (!container?.contains(new ItemStack(requiredItem, 1))) missingItems.push(requiredItem);
        }
        if (missingItems.length > 0) {
            player.sendMessage(`§7[§r§dChat Ranks§7]§r §cYou need to hold the following items to chat: §f${missingItems.join(', ')}`);
            return '';
        }
    }

    const customName = player.getTags().find(tag => tag.startsWith("chatName:"));
    if (customName) displayName = customName.split(":")[1];

    if (player.name === "XxVoidicxX") displayName = "§dXxVoidicxX";

    if (player.hasTag("chatNormal")) return `<${displayName}§r> ${message}`;

    let rank = getRank(player);

    if (!rank || rank.trim() === '' || rank.trim().toLowerCase() === 'member') {
        rank = CREATOR_RANK;
    }

    if (player.name === "XxVoidicxX" && !rank.includes(CREATOR_RANK)) {
        if (rank.includes(RANK_JOIN.trim())) {
            rank = rank + RANK_JOIN + CREATOR_RANK;
        } else if (rank.length > 0) {
            rank = rank + RANK_JOIN + CREATOR_RANK;
        } else {
            rank = CREATOR_RANK;
        }
    }

    let chatMessage;

    if (player.hasTag("hideChatName")) {
        chatMessage = '§r§7§l > §r' + getColor(player, CHAT_COLOR_PREFIX, message);
    } else if (player.hasTag("hideChatRank") && player.hasTag("hideChatClan")) {
        chatMessage = '§r' + getColor(player, NAMETAG_COLOR_PREFIX, displayName) + '§r§7§l > §r' + getColor(player, CHAT_COLOR_PREFIX, message);
    } else if (player.hasTag("hideChatRank")) {
        chatMessage = '§r' + getConfig(player, 'dimension') + (clanTag ? `§7<§f${clanTag}§r§7> ` : '') + getColor(player, NAMETAG_COLOR_PREFIX, displayName) + '§r§7§l > §r' + getColor(player, CHAT_COLOR_PREFIX, message);
    } else if (player.hasTag("hideChatClan")) {
        chatMessage = '§r' + getConfig(player, 'dimension') + '§r§7[§f' + rank + '§r§7] ' + getColor(player, NAMETAG_COLOR_PREFIX, displayName) + '§r§7§l > §r' + getColor(player, CHAT_COLOR_PREFIX, message);
    } else {
        chatMessage = '§r' + getConfig(player, 'dimension') + '§r§7[§f' + rank + '§r§7] ' + (clanTag ? `§7<§f${clanTag}§r§7> ` : '') + getColor(player, NAMETAG_COLOR_PREFIX, displayName) + '§r§7§l > §r' + getColor(player, CHAT_COLOR_PREFIX, message);
    }

    return chatMessage;
}
