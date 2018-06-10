#!/usr/bin/env node

const { mochawesomeToMarkdown } = require("../src/mochawesome_to_markdown.bin");

return mochawesomeToMarkdown(process.argv.slice(2)).then(process.exit);
