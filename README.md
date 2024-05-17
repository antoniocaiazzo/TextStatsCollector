# TextStatsCollector

This is a CLI application written in Node.js and TypeScript that accepts a file path or a remote URL of a text file and streams its content to collect some statistics about the content.
The whole process is based on async/await and streams, so the input file can be of any size. It also supports Unicode when counting characters, so the source can also be written in any language.

These are the statistics that get collected:
- total amount of letters
- total amount of spaces
- total amount of words
- list of words that appear more than 10 times, with their occurrences

## Usage

The app is provided as both a CLI tool and as a Microservice via API, using a Koa server.

First and foremost install dependencies and build the tool:

```bash
npm install
npm run build
```

The build process will output all transpiled sources into the `dist/` directory.

1. Run as a CLI tool

```bash
node dist/bin/cli.js --help

node dist/bin/cli.js "<path|URL>"
```

2. Run as a Microservice API

```bash
npm run start
```

The Koa server will start listening on: `https://localhost:3000`. Here are some example requests:

```text
http://localhost:3000/stats?uri=tests/source.txt
http://localhost:3000/stats?uri=https://www.ietf.org/rfc/rfc793.txt
```

### Output

In both cases the tool outputs a JSON object. When running on the command line there is an option to enable formatting.


## Installation

If you want to use this tool from anywhere in your shell, there are 2 possible ways.

1. Install it globally:
```bash
npm install -g .
# uninstall it with: npm uninstall -g .
```

2. Symlink it:
```bash
npm link .
# unlink it with: npm unlink .
```

Either way it will be then available as:

```bash
stats "https://www.ietf.org/rfc/rfc793.txt"
```

## Development

You can also run the Microservice API in dev mode with:

```bash
npm run dev
```

This will run the Koa server and Node.js in debug mode with `--inspect` so a debugger can be attached.

## Tests

Running tests is just a matter of invoking:

```bash
npm test
```