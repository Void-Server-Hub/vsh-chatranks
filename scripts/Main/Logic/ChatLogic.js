import { getColor, getConfig } from './NameMessageLogic/NameMessageLogic.js';
import { getRank } from './RankLogic.js';
import { NAMETAG_COLOR_PREFIX, CHAT_COLOR_PREFIX } from '../Configs/Config.js';

export function processChatMessage(player, message, displayName, clanTag) {
    let customName = player.getTags().find(tag => tag.startsWith("chatName:"));
    if (customName) {
        displayName = customName.split(":")[1];
    }

    if (player.hasTag("chatNormal")) {
        return `<${displayName}§r> ${message}`;
    }

    let chatMessage;

    if (player.hasTag("hideChatName")) {
        chatMessage = '§r§7§l > §r' + getColor(player, CHAT_COLOR_PREFIX, message);
    } else {
        if (player.hasTag("hideChatRank") && player.hasTag("hideChatClan")) {
            chatMessage = '§r' + getColor(player, NAMETAG_COLOR_PREFIX, displayName) + '§r§7§l > §r' + getColor(player, CHAT_COLOR_PREFIX, message);
        } else if (player.hasTag("hideChatRank")) {
            chatMessage = '§r' + getConfig(player, 'dimension') + (clanTag ? `§7<§f${clanTag}§r§7> ` : '') + getColor(player, NAMETAG_COLOR_PREFIX, displayName) + '§r§7§l > §r' + getColor(player, CHAT_COLOR_PREFIX, message);
        } else if (player.hasTag("hideChatClan")) {
            chatMessage = '§r' + getConfig(player, 'dimension') + '§r§7[§f' + getRank(player) + '§r§7] ' + getColor(player, NAMETAG_COLOR_PREFIX, displayName) + '§r§7§l > §r' + getColor(player, CHAT_COLOR_PREFIX, message);
        } else {
            chatMessage = '§r' + getConfig(player, 'dimension') + '§r§7[§f' + getRank(player) + '§r§7] ' + (clanTag ? `§7<§f${clanTag}§r§7> ` : '') + getColor(player, NAMETAG_COLOR_PREFIX, displayName) + '§r§7§l > §r' + getColor(player, CHAT_COLOR_PREFIX, message);
        }
    }

    return chatMessage;
}