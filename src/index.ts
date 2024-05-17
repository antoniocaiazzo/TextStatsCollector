import 'dotenv/config';

// all imports from outside the src directory pass by here, so that dotenv can be loaded

export { default as server } from './microservice/server';

export { collectStatsFromSource } from './app';

export * from './services/textStreamParser';
export * from './services/textStatsCollector';
export * from './services/sourceStreamers';

export * from './lib/interfaces';
export * from './lib/factories';
export * from './lib/enums';
