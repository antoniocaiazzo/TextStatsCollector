import { TextStatsDict, collectStatsFromSource } from '../src';

describe('end2end tests for collecting stats from a streamed text source', () => {
    it('collects stats from a local file', async () => {
        const uri: string = 'tests/source.txt';
        const stats: TextStatsDict = await collectStatsFromSource(uri);
        expect(stats).toEqual({
            LettersCount: 1754,
            SpacesCount: 429,
            WordsCount: 415,
            WordsOccurrences: { Why: 14, "don't": 14, Because: 13, about: 12, the: 27 },
        });
    });

    it('collects stats from a remote file', async () => {
        const uri: string = 'https://www.ndl.go.jp/jp/library/supportvisual/plain_text.txt';
        const stats: TextStatsDict = await collectStatsFromSource(uri);
        expect(stats).toEqual({
            LettersCount: 37653,
            SpacesCount: 9127,
            WordsCount: 7542,
            WordsOccurrences: {
                '1': 11,
                '2': 14,
                '(発売)': 108,
                '2022.3': 60,
                '2023.3': 52,
                ':': 339,
                ';': 217,
                '=': 28,
                KADOKAWA: 16,
                '[未校正テキスト]': 191,
                '[著]': 56,
                みすず書房: 17,
                アネコユサギ: 15,
                'カール・マルクス': 12,
                ミネルヴァ書房: 24,
                下河辺元春: 12,
                全国音訳ボランティアネットワーク: 37,
                千葉県立西部図書館: 59,
                名古屋市鶴舞中央図書館点字文庫: 15,
                国立国会図書館: 372,
                大阪大学附属図書館: 18,
                岩波書店: 39,
                '放送大学教育振興会||NHK出版': 103,
                放送大学附属図書館: 111,
                新日本出版社: 15,
                日本共産党中央委員会社会科学研究所: 12,
                明石書店: 14,
                有斐閣: 15,
                東京大学出版会: 23,
                東京大学総合図書館: 11,
                監修: 42,
                盾の勇者の成り上がり: 15,
                立命館大学図書館: 173,
                筑波大学附属図書館: 52,
                編: 145,
                編著: 160,
                芦田均日記: 12,
                著: 383,
                訳: 92,
                講談社: 13,
                資本論: 12,
                雄山閣出版: 12,
            },
        });
    });
});
