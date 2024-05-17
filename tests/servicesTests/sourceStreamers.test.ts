import fs from 'fs';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';
import { FileStreamer, URLStreamer } from '../../src';

jest.mock('fs');
global.fetch = jest.fn();

describe('creates a Readable stream from a local file', () => {
    beforeAll(() => {
        (fs.createReadStream as jest.Mock).mockClear();
    });

    it('should return a Readable stream from a valid text file', async () => {
        (fs.createReadStream as jest.Mock).mockReturnValue(new Readable());

        const streamer = new FileStreamer('/path/to/file.txt');
        const result = await streamer.stream();

        expect(result).toBeInstanceOf(Readable);
    });

    it('should throw when there is an error reading the file', async () => {
        const mockError = new Error('Failed to read file');
        (fs.createReadStream as jest.Mock).mockRejectedValue(mockError);

        const streamer = new FileStreamer('/path/to/file.txt');

        await expect(streamer.stream()).rejects.toThrow(mockError);
    });
});

describe('creates a Readable stream from a remote URL', () => {
    beforeAll(() => {
        (fetch as jest.Mock).mockClear();
    });

    it('should return a Readable stream from a valid remote text file', async () => {
        (fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: true,
                body: new ReadableStream(),
            }),
        );

        const streamer = new URLStreamer('https://example.com/file.txt');
        const result = await streamer.stream();

        expect(result).toBeInstanceOf(Readable);
    });

    it('should return an empty Readable stream if the response body is null', async () => {
        (fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: true,
                body: null,
            }),
        );

        const streamer = new URLStreamer('https://example.com/file.txt');
        const result = await streamer.stream();

        expect(result).toBeInstanceOf(Readable);

        const content = [];
        for await (const chunk of result) {
            content.push(chunk);
        }
        expect(content.length).toBe(0);
    });

    it('should throw when there is an error fetching the file', async () => {
        (fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: false,
            }),
        );

        const streamer = new URLStreamer('https://example.com/file.txt');

        await expect(streamer.stream()).rejects.toThrow();
    });
});
