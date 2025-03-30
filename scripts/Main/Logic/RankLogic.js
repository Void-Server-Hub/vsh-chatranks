import {
    DEFAULT_RANK,
    RANK_PREFIX,
    RANK_JOIN
} from "../Configs/Config.js";

export function getRank(player) {
    try {
        let ranks = player.getTags();
        let ranksArray = [];
        
        for (let i = 0; i < ranks.length; i++) {
            for (let prefix of RANK_PREFIX) {
                if (ranks[i].startsWith(prefix)) {
                    let rankWithoutPrefix = ranks[i].replace(prefix, '');
                    ranksArray.push(rankWithoutPrefix + '§r');
                    break;
                }
            }
        }
        
        return ranksArray.length === 0 ? DEFAULT_RANK : ranksArray.join(RANK_JOIN);
    } catch (error) {
        console.error('Error in getRank function:', error);
        return DEFAULT_RANK;
    }
}
