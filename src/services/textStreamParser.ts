import { Writable } from 'stream';
import { TextEvent } from '../lib/enums';
import { StringTokensEmitter } from '../lib/interfaces';

export class TextStreamParser extends Writable implements StringTokensEmitter {
    // internal state to detect words which might span over multiple chunks
    private wordBuffer: string[] = [];

    constructor() {
        super();
    }

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        chunk = chunk.toString();

        for (const char of chunk) {
            if (/\s/.test(char)) {
                // emitting single spaces, including new lines and tabs
                this.emitSpaceEvent(char);
                // emitting a word event in case a space character just marked the end of a word
                this.emitWordEvent();
            }

            // for simplicity and to be able to catch all those compounded words (e.g. containing apostrophes or hyphens),
            // we record all characters in between spaces, even though we might include marks and numbers
            if (/\S/.test(char)) {
                this.wordBuffer.push(char);
            }

            // emitting single letters only, ignoring any special character or punctuation (unicode aware)
            if (/\p{L}/u.test(char)) {
                this.emitLetterEvent(char);
            }
        }

        callback();
    }

    _final(callback: (error?: Error | null) => void) {
        // emits the last word detected when the stream has ended
        this.emitWordEvent();
        callback();
    }

    /**
     * Flushes the word buffer into a single string containing the current word.
     * After this the buffer is empty and ready for the next word.
     * @private
     * @returns a string containing the current word, or null in case nothing has been recorded
     */
    private flushWord(): string | null {
        const word = this.wordBuffer.join('').trim();
        // emitting the whole word as a string only if it's not empty (might happen with consecutive spaces)
        if (word.length === 0) {
            return null;
        }

        // resetting the buffer for the next word and returning the current one
        this.wordBuffer = [];
        return word;
    }

    /**
     * Emits a Word event when a non-empty word has been completely recorded
     * @private
     */
    private emitWordEvent() {
        const word = this.flushWord();
        if (word !== null) {
            this.emit(TextEvent.Word, word);
        }
    }

    /**
     * Emits a single Space event
     * @param char
     * @private
     */
    private emitSpaceEvent(char: string) {
        this.emit(TextEvent.Space, char);
    }

    /**
     * Emits a single Letter event
     * @param char
     * @private
     */
    private emitLetterEvent(char: string) {
        this.emit(TextEvent.Letter, char);
    }
}
