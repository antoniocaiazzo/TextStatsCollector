import { SourceStreamer } from './interfaces';
import { FileStreamer, URLStreamer } from '../services/sourceStreamers';

export function createSourceStreamer(uri: string): SourceStreamer {
    if (uri.startsWith('http')) {
        return new URLStreamer(uri);
    } else {
        return new FileStreamer(uri);
    }
}
