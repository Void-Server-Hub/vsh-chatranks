import { DEFAULT_CHAT_COLOR, CHAT_COLOR_PREFIX, DEFAULT_NAMETAG_COLOR, NAMETAG_COLOR_PREFIX, CONFIGTAG } from '../../Configs/Config.js';
import CustomText from '../../Other/Class/CustomTextClass.js';

export const colorMap = {
    'black': '§0',
    'darkBlue': '§1',
    'darkGreen': '§2',
    'darkAqua': '§3',
    'darkRed': '§4',
    'darkPurple': '§5',
    'gold': '§6',
    'gray': '§7',
    'darkGray': '§8',
    'blue': '§9',
    'green': '§a',
    'aqua': '§b',
    'red': '§c',
    'lightPurple': '§d',
    'yellow': '§e',
    'white': '§f',
    'minecoinGold': '§g',
    'blueDarkGrey': '§t',
    'mediumPurple': '§u',
    'darkOrange': '§p',
    'mediumGreen': '§q',
    'mediumCyan': '§s',
    'beige': '§h',
    'darkBrown': '§j',
    'mediumRed': '§m',
    'brown': '§n'
};

export const gradientTypes = [
    'randomRaimbow', 'raimbow', 'blueGradient', 'randomBlueGradient',
    'yellowGradient', 'randomYellowGradient', 'blackGradient',
    'randomBlackGradient', 'grayGradient', 'randomGrayGradient',
    'purpleGradient', 'randomPurpleGradient'
];

export function getColor(player, tagseparator, message) {
    const chatColorTag = player
        .getTags()
        .find((tag) => tag.startsWith(tagseparator) && !tag.endsWith('bold') && !tag.endsWith('italic') && !tag.endsWith('glitch'));

    let Symbols = [];

    ['glitch', 'bold', 'italic'].forEach(symbol => {
        if (player.hasTag(tagseparator + symbol) || player.hasTag(tagseparator + `§${symbol[0]}`)) {
            Symbols.push(`§${symbol[0]}`);
        }
    });

    const otherSymbols = Symbols.join('');

    if (!chatColorTag) {
        switch (tagseparator) {
            case NAMETAG_COLOR_PREFIX:
                return otherSymbols + DEFAULT_NAMETAG_COLOR + message;
            case CHAT_COLOR_PREFIX:
                return otherSymbols + DEFAULT_CHAT_COLOR + message;
        }
    }

    const colorKey = chatColorTag.replace(tagseparator, '');
    if (colorMap[colorKey]) {
        return otherSymbols + colorMap[colorKey] + message;
    } else if (gradientTypes.includes(colorKey)) {
        return otherSymbols + new CustomText(message).setGradient(colorKey);
    } else {
        return otherSymbols + (tagseparator === NAMETAG_COLOR_PREFIX ? DEFAULT_NAMETAG_COLOR : DEFAULT_CHAT_COLOR) + message;
    }
}

export function getDimension(player) {
    const dimensionMap = {
        'minecraft:overworld': '§r§7<§f§aOverWorld§7> §r',
        'minecraft:nether': '§r§7<§f§4Nether§7> §r',
        'minecraft:the_end': '§r§7<§f§dEnder§7> §r'
    };

    return dimensionMap[player.dimension.id] || '';
}

export function getConfig(player, type = null) {
    switch (type) {
        case 'dimension':
            return player.hasTag(CONFIGTAG + 'dimension') ? getDimension(player) : '';
        case 'health':
            if (player.hasTag(CONFIGTAG + 'health')) {
                const health = Math.round(player.getComponent('health').currentValue * 10) / 10;
                return `\n§c${health}§4/§c${player.getComponent('health').effectiveMax}`;
            }
            return '';
        default:
            return '';
    }
}
