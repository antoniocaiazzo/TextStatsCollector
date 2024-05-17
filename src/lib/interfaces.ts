import { Readable } from 'stream';
import { TextEvent, TextStat } from './enums';

export interface SourceStreamer {
    stream(): Promise<Readable>;
}

export interface StringTokensEmitter {
    on(event: TextEvent, listener: (token: string) => void): void;
}

export interface StatsCollector {
    getStat(stat: TextStat): any;
    getAllStats(): TextStatsDict;
}

export type WordsOccurrencesDict = {
    [index: string]: number;
};

export type TextStatsDict = {
    [index in TextStat]?: any;
};
