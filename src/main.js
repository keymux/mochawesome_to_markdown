const { mochawesomeToMarkdown } = require("./mochawesome_to_markdown.bin");

mochawesomeToMarkdown(process.argv.slice(2)).then(process.exit);
