import { WordsOccurrencesDict, StatsCollector, TextStatsDict, StringTokensEmitter } from '../lib/interfaces';
import { TextEvent, TextStat } from '../lib/enums';

export class TextStatsCollector implements StatsCollector {
    private parser: StringTokensEmitter;

    private readonly commonWordThreshold: number;
    private stats: TextStatsDict = {
        [TextStat.LettersCount]: 0,
        [TextStat.SpacesCount]: 0,
        [TextStat.WordsCount]: 0,
        [TextStat.WordsOccurrences]: {},
    };

    constructor(parser: StringTokensEmitter, commonWordThreshold: number = 10) {
        this.parser = parser;
        this.commonWordThreshold = commonWordThreshold;
        this.registerOnParser();
    }

    /**
     * Attaches callbacks to the parser's emitters, so to update the stats after each event.
     * @private
     */
    private registerOnParser() {
        this.parser.on(TextEvent.Letter, () => {
            this.stats[TextStat.LettersCount]++;
        });

        this.parser.on(TextEvent.Space, () => {
            this.stats[TextStat.SpacesCount]++;
        });

        this.parser.on(TextEvent.Word, word => {
            this.stats[TextStat.WordsCount]++;
            // updating specific word counting stats
            this.stats[TextStat.WordsOccurrences][word] = this.stats[TextStat.WordsOccurrences][word] || 0;
            this.stats[TextStat.WordsOccurrences][word]++;
        });
    }

    /**
     * Provides a view of all the words' stats that shows only words with above threshold occurrences
     * @private
     */
    private filterCommonWordsOnly(): WordsOccurrencesDict {
        const words: WordsOccurrencesDict = this.stats[TextStat.WordsOccurrences];
        // filtering words occurrences object by values and then rebuilding it
        return Object.fromEntries(Object.entries(words).filter(([, counter]) => counter > this.commonWordThreshold));
    }

    /**
     * Retrieving a single statistic
     * @param stat {TextStat}
     * @returns the value for the requested statistic
     */
    getStat(stat: TextStat): any {
        if (stat === TextStat.WordsOccurrences) {
            return this.filterCommonWordsOnly();
        }
        return this.stats[stat];
    }

    /**
     * Retrieving all statistics at once
     * @returns an object with {@link TextStat} as keys
     */
    getAllStats(): TextStatsDict {
        const statsCopy: TextStatsDict = { ...this.stats };
        statsCopy[TextStat.WordsOccurrences] = this.filterCommonWordsOnly();
        return statsCopy;
    }
}
