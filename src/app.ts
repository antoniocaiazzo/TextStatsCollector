import { TextStatsDict } from './lib/interfaces';
import { createSourceStreamer } from './lib/factories';
import { TextStreamParser } from './services/textStreamParser';
import { TextStatsCollector } from './services/textStatsCollector';
import * as stream from 'node:stream';
import { promisify } from 'node:util';

// allows to forward all errors thrown in any point of the stream and catch them with a try/catch
const pipeline = promisify(stream.pipeline);

export async function collectStatsFromSource(uri: string): Promise<TextStatsDict> {
    const streamer = createSourceStreamer(uri);
    const source: stream.Readable = await streamer.stream();

    const parser = new TextStreamParser();
    const collector = new TextStatsCollector(parser);

    await pipeline(source, parser);

    return collector.getAllStats();
}
