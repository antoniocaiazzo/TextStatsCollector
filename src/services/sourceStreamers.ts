import { SourceStreamer } from '../lib/interfaces';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import { ReadableStream } from 'stream/web';

export class FileStreamer implements SourceStreamer {
    private readonly uri: string;

    constructor(uri: string) {
        this.uri = uri;
    }

    async stream(): Promise<Readable> {
        return createReadStream(this.uri, 'utf-8');
    }
}

export class URLStreamer implements SourceStreamer {
    private readonly uri: string;

    constructor(uri: string) {
        this.uri = uri;
    }

    async stream(): Promise<Readable> {
        const response = await fetch(this.uri);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        // request succeeded but the body is missing or empty, treat it as an empty stream
        if (!response.body) {
            return Readable.from([]);
        }
        // see comments on https://stackoverflow.com/a/74722818/1226990 for issue with ReadableStream types defined in different modules
        return Readable.fromWeb(response.body as ReadableStream<any>, { encoding: 'utf-8' });
    }
}
