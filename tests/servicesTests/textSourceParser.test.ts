import { TextStreamParser, TextEvent } from '../../src';
import { Readable, once } from 'stream';

describe('emits simple characters events from a stream', () => {
    it('emits one event per letter and per space, ignoring other characters', () => {
        const parser = new TextStreamParser();

        const letters: string[] = [];
        const spaces: string[] = [];

        parser.on(TextEvent.Letter, letter => {
            letters.push(letter);
        });
        parser.on(TextEvent.Space, space => {
            spaces.push(space);
        });

        parser.write('abc def   fgh\n999\t,.-_');
        parser.end();

        expect(letters.join('')).toBe('abcdeffgh');
        expect(spaces.join('')).toBe('    \n\t');
    });

    it('emits nothing from an empty stream', () => {
        const parser = new TextStreamParser();

        const letters: string[] = [];
        const spaces: string[] = [];

        parser.on(TextEvent.Letter, letter => {
            letters.push(letter);
        });
        parser.on(TextEvent.Space, space => {
            spaces.push(space);
        });

        parser.write('');
        parser.end();

        expect(letters.join('')).toBe('');
        expect(spaces.join('')).toBe('');
    });
});

describe('emits word events from a stream', () => {
    it('emits word events contained in a single chunk', () => {
        const parser = new TextStreamParser();

        const words: string[] = [];

        parser.on(TextEvent.Word, word => {
            words.push(word);
        });

        parser.write('what did the duck do?');
        parser.end();

        expect(words).toEqual(['what', 'did', 'the', 'duck', 'do?']);
    });

    it('emits word events aggregating word pieces from multiple chunks', () => {
        const parser = new TextStreamParser();

        const words: string[] = [];

        parser.on(TextEvent.Word, word => {
            words.push(word);
        });

        parser.write('I tell');
        parser.write(' you what the duck did');
        parser.write("n't do:");
        parser.end();

        expect(words).toEqual(['I', 'tell', 'you', 'what', 'the', 'duck', "didn't", 'do:']);
    });

    it('emits one word event for a single word', () => {
        const parser = new TextStreamParser();

        const words: string[] = [];

        parser.on(TextEvent.Word, word => {
            words.push(word);
        });

        parser.write('supercalifragilistic');
        parser.write('expialidocious');
        parser.end();

        expect(words).toEqual(['supercalifragilisticexpialidocious']);
    });

    it('emits nothing from an empty stream', () => {
        const parser = new TextStreamParser();

        const words: string[] = [];

        parser.on(TextEvent.Word, word => {
            words.push(word);
        });

        parser.write('');
        parser.end();

        expect(words).toEqual([]);
    });
});

describe('how the class is designed to be used', () => {
    it('pipes chunks from a Readable stream', async () => {
        const parser = new TextStreamParser();

        const letters: string[] = [];
        parser.on(TextEvent.Letter, letter => {
            letters.push(letter);
        });

        const readStream = Readable.from(['__snake_', '_case__']);
        const stream = readStream.pipe(parser);
        await once(stream, 'finish');

        expect(letters.join('')).toBe('snakecase');
    });
});
