import { world, system } from '@minecraft/server';
import { processChatMessage } from './Main/Logic/ChatLogic.js';
import { updateNameTags } from './Main/Logic/NameLogic.js';
import { getFormattedCooldown, handleCooldown } from './Main/Logic/CoolDown/cooldown.js';
import Config from './Main/Configs/Config.js';

export function handleClanTagCommand(player, args) {
    try {
        if (!player.hasTag('clanEdit')) {
            player.sendMessage('§7[§r§dChat Ranks§7]§r §cYou don\'t have permission to edit clan tags!');
            return;
        }

        const dimension = player.dimension;
        const playerName = player.name;
        const existingTags = player.getTags();

        if (args.length === 1 && args[0].toLowerCase() === 'clear') {
            system.run(() => {
                for (const tag of existingTags) {
                    if (tag.startsWith('clanTag:')) {
                        try {
                            dimension.runCommand(`execute as "${playerName}" run tag @s remove "${tag}"`);
                        } catch (e) {
                            console.warn(`Failed to remove tag ${tag} from ${playerName}`);
                        }
                    }
                }
                player.sendMessage('§7[§r§dChat Ranks§7]§r §aYour clan tag has been cleared.');
            });
            return;
        }

        if (!args || args.length === 0) {
            player.sendMessage('§7[§r§dChat Ranks§7]§r §eUsage: -clantag <tag> (1-6 characters) or -clantag clear');
            return;
        }

        const clanTag = args.join(' ');
        const cleanTag = clanTag.replace(/§[0-9a-fk-or]/gi, '');

        if (cleanTag.length < 1 || cleanTag.length > 6) {
            player.sendMessage('§7[§r§dChat Ranks§7]§r §cClan tag must be 1-6 characters (color codes not counted)');
            return;
        }

        system.run(() => {
            for (const tag of existingTags) {
                if (tag.startsWith('clanTag:')) {
                    try {
                        dimension.runCommand(`execute as "${playerName}" run tag @s remove "${tag}"`);
                    } catch (e) {
                        console.warn(`Failed to remove tag ${tag} from ${playerName}`);
                    }
                }
            }

            try {
                dimension.runCommand(`execute as "${playerName}" run tag @s add "clanTag:${clanTag}"`);
                player.sendMessage(`§7[§r§dChat Ranks§7]§r §aYour clan tag has been updated to: ${clanTag}`);
            } catch (e) {
                player.sendMessage('§7[§r§dChat Ranks§7]§r §cAn error occurred while updating your clan tag.');
            }
        });

    } catch (error) {
        console.error(`Error handling clan tag command: ${error}`);
        player.sendMessage('§7[§r§dChat Ranks§7]§r §cAn error occurred while updating your clan tag');
    }
}

const lastMessages = new Map();

function normalizeMessage(message) {
    return message.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().trim();
}

world.beforeEvents.chatSend.subscribe((data) => {
    try {
        const player = data.sender;
        const message = data.message.trim();

        if (message.startsWith('-clantag')) {
            data.cancel = true;
            const args = message.split(' ').slice(1);
            handleClanTagCommand(player, args);
            return;
        }

        if (message === '-wipechat') {
            data.cancel = true;
            player.sendMessage('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n§7[§dChat Ranks§7] §fChat Wiped')
        }

        if (message === '-chatranks') {
            data.cancel = true;
            const chatRanks = [
                '§l§e===== §aVersion §d1.0.13 §e=====§r',
                '§l§e===== Rank & Name Customization =====§r',
                '§e>§f rank:<rank>§r - Displays the normal chat rank next to the player\'s name in chat',
                '§e>§f customName:<name>§r - Changes the player\'s name above their model',
                '§e>§f chatName:<name>§r - Changes the player\'s name in chat',
                '§e>§f chatNormal§r - Fakes normal format when they type and has no ranks (chatName still works here)',
                '§l§e===== Hiding Sections =====§r',
                '§c>§f hideName§r - Hides the player\'s name above their model',
                '§c>§f hideChatName§r - Hides ranks in chat',
                '§c>§f hideNameRank§r - Hides ranks next to the player\'s name above their model',
                '§c>§f hideNameClan§r - Hides the clan tag from name above player model',
                '§c>§f hideChatClan§r - Hides the clan tag from a player in chat',
                '§aNEW §c>§f chatItemRequire:<item ID name> - requires the item to be in the inv before chatting',
                '§l§e===== Mute & Spam Control =====§r',
                '§b>§f mute§r - Mutes the player and prevents them from sending messages in chat',
                '§b>§f CRSpamSkip§r - Allows player to repeat messages',
                '§b>§f CRDelaySkip§r - Allows player to message without waiting',
                '§l§6===== Configuration Options =====§r',
                '§a>§f config:health§r - Displays the player\'s health in a 20/20 format below their name',
                '§a>§f config:dimension§r - Shows the dimension next to the player in chat',
                '§l§e===== Clan Tag =====§r',
                '§d>§f -clantag <Name>§r - The clan tag that appears before a name (Preferably 4-6 characters | Only supports 1 and oldest clantag applied)',
                '',
                '§7Example:§r /tag @s add rank:Cool',
                '§7Example:§r /tag playerName rank:Cool',
                '',
                '§6Supported rank formats:§r §f\'rank:\', \"r:\", \"Rank:\", \"role:\", \"title:\", \"R:\"',
                '',
                '§l§e===== Custom Commands =====§r',
                '§aNEW §d>§f §aRequires §eclanEdit §atag to use',
                '§aNEW §d>§f -clantag <1-6 Characters>, adds a clan tag, removes old one',
                '§aNEW §d>§f -clantag clear, will clear your current clan tag',
                '',
                '§aNEW §7Example:§r -clantag VSH',
                '',
                '§aNEW §d>§f -wipechat, clears the chat screen personally',
                '',
                '§l§e===== Credits =====§r',
                '§aNEW §aCreated by §dXxVoidicxX §e/ §bDiscord: §d@xxvoidicxx',
                '§aNEW §aSupport Server/Network > §bdiscord.gg/vsh'
            ];
            let response = '§7[§r§dChat Ranks§7]§r §aAvailable Chat Ranks Tags:\n';
            response += chatRanks.map(rank => `§7- §r§f${rank}`).join('\n');
            player.sendMessage(response);
            return;
        }

        data.cancel = true;
        let displayName = player.name;
        const customTag = player.getTags().find(tag => tag.startsWith('chatName:'));
        if (customTag) {
            displayName = customTag.split(':')[1];
        }

        let clanTag = '';
        const playerClanTag = player.getTags().find(tag => tag.startsWith('clanTag:'));
        if (playerClanTag) {
            clanTag = playerClanTag.split('clanTag:')[1];
        }

        if (player.hasTag("hideChatClan")) {
            clanTag = '';
        }

        if (player.hasTag('mute')) {
            player.sendMessage('§7[§r§dChat Ranks§7]§r §cYou are muted!');
            return;
        }

        if (!handleCooldown(player.id)) {
            player.sendMessage(
                `§7[§r§dChat Ranks§7]§r §cDon't spam the chat, please wait ${getFormattedCooldown(player.id)}s`
            );
            return;
        }

        if (Config.MAX_CHAR_PER_MESSAGE && message.length > Config.MAX_CHAR_PER_MESSAGE) {
            player.sendMessage(
                `§7[§r§dChat Ranks§7]§r §cMessage exceeds ${Config.MAX_CHAR_PER_MESSAGE} characters.`
            );
            return;
        }

        const normalizedMessage = normalizeMessage(message);
        const lastMessage = lastMessages.get(player.id);

        if (!player.hasTag("CRSpamSkip") && lastMessage === normalizedMessage) {
            player.sendMessage('§7[§r§dChat Ranks§7]§r §cYou cannot send the same message twice!');
            return;
        }

        lastMessages.set(player.id, normalizedMessage);
        const chatMessage = processChatMessage(player, message, displayName, clanTag);

        const rawText = {
            rawtext: [{
                text: chatMessage
            }]
        };
        const tellrawCmd = `tellraw @a ${JSON.stringify(rawText)}`;

        system.run(() => {
            try {
                world.getDimension("overworld").runCommand(tellrawCmd);
            } catch (e) {
                console.error(`[ChatRanks] Tellraw failed: ${e}\nCommand: ${tellrawCmd}`);
            }
        });
    } catch (error) {
        console.error(`Chat processing error: ${error.message}`);
    }
});

system.runInterval(() => {
    try {
        for (const player of world.getPlayers()) {
            updateNameTags(player);
        }
    } catch (error) {
        console.error(`NameTag update error: ${error.message}`);
    }
});