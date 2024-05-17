#! /usr/bin/env -S node --no-warnings

import { Command } from 'commander';
import figlet from 'figlet';
import { TextStatsDict, collectStatsFromSource } from '../src';

async function main(uri: string, raw: boolean = false) {
    const stats: TextStatsDict = await collectStatsFromSource(uri);
    console.log(JSON.stringify(stats, null, raw ? 0 : 2));
}

const app = new Command();

app.version('1.0.0')
    .description('Shows stats from file or URL in JSON format')
    .option('-q, --quiet', 'Outputs just the result JSON (and errors)', false)
    .option('-r, --raw', 'Disables JSON formatting', false)
    .argument('<uri>', 'file path or remote URL')
    .action(async (uri, options) => {
        try {
            if (!options.quiet) {
                console.log(figlet.textSync('Text Stats Collector', { horizontalLayout: 'fitted' }));
                console.log(`Collecting stats from: ${uri} ...`);
                console.log();
            }
            await main(uri, options.raw);
        } catch (error) {
            console.error('There has been an unexpected error!');
            console.error(error);
        }
    });

app.parse();
