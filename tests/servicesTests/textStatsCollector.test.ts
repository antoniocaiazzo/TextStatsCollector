import { StatsCollector, TextStatsDict, StringTokensEmitter, TextStatsCollector, TextEvent, TextStat } from '../../src';

describe('stats are collected from text events', () => {
    it('collects basic stats', () => {
        const parser: StringTokensEmitter = new (class implements StringTokensEmitter {
            on(event: TextEvent, listener: (token: string) => void): void {
                switch (event) {
                    case TextEvent.Letter:
                        listener('b');
                        listener('l');
                        listener('a');
                        break;
                    case TextEvent.Space:
                        listener(' ');
                        break;
                    case TextEvent.Word:
                        listener('bla');
                        break;
                }
            }
        })();

        const collector: StatsCollector = new TextStatsCollector(parser);

        const result: TextStatsDict = collector.getAllStats();
        expect(result).toEqual({
            [TextStat.LettersCount]: 3,
            [TextStat.SpacesCount]: 1,
            [TextStat.WordsCount]: 1,
            [TextStat.WordsOccurrences]: {},
        });
    });

    it('collects stats about common words', () => {
        const parser: StringTokensEmitter = new (class implements StringTokensEmitter {
            on(event: TextEvent, listener: (token: string) => void): void {
                switch (event) {
                    case TextEvent.Word:
                        listener('the');
                        listener('bla');
                        listener('bla');
                        listener('bla');
                        break;
                }
            }
        })();

        const collector: StatsCollector = new TextStatsCollector(parser, 2);

        const result: TextStatsDict = collector.getAllStats();
        expect(result[TextStat.WordsOccurrences]).toEqual({
            bla: 3,
        });
    });

    it('has all stats initialized', () => {
        const parser: StringTokensEmitter = new (class implements StringTokensEmitter {
            on(event: TextEvent, listener: (token: string) => void): void {}
        })();

        const collector: StatsCollector = new TextStatsCollector(parser);

        const result: TextStatsDict = collector.getAllStats();
        expect(result).toEqual({
            [TextStat.LettersCount]: 0,
            [TextStat.SpacesCount]: 0,
            [TextStat.WordsCount]: 0,
            [TextStat.WordsOccurrences]: {},
        });
    });
});
