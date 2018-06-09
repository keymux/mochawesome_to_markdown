const minimist = require("minimist");
const path = require("path");

const _defaults = {
  fields: ["passPercent", "passes", "failures", "skipped", "tests", "duration"],
  headers: [
    "Pass (%)",
    "Pass (count)",
    "Failures (count)",
    "Skips (count)",
    "Total (count)",
    "Duration",
  ],
  prefixes: new Array(6).fill(""),
  suffixes: ["%", "", "", "", "", "ms"],
};

const _isUndefinedOrArray = (argv, field) => {
  if (argv[field] === undefined || argv[field] instanceof Array) {
    return true;
  }

  return false;
};

const _minimistTestableCreator = minimist => options => args =>
  minimist(args, options);

const _minimistCreator = _minimistTestableCreator(minimist);

const _setDefaults = argv =>
  Object.assign({}, argv, {
    headers: (argv && argv.headers) || _defaults.headers,
    fields: (argv && argv.fields) || _defaults.fields,
    prefixes: (argv && argv.prefixes) || _defaults.prefixes,
    suffixes: (argv && argv.suffixes) || _defaults.suffixes,
  });

const _addMochawesomeJson = argv =>
  Object.assign({}, argv, { json: require(path.resolve(argv["mochawesome"])) });

const _reduceHeaders = headers =>
  headers.reduce((acc, header) => acc + ` ${header} |`, "|");

const _addHeader = argv =>
  Object.assign({}, argv, {
    md: argv.md.concat([_reduceHeaders(argv.headers)]),
  });

const _reduceUnderlineRow = argv =>
  argv.fields.reduce(acc => acc + " --- |", "|");

const _addUnderlineRow = argv =>
  Object.assign({}, argv, {
    md: argv.md.concat([_reduceUnderlineRow(argv)]),
  });

const _reduceDataRow = ({ fields, json, prefixes, suffixes }) =>
  fields
    .map((field, i) => ` ${prefixes[i]}${json.stats[field]}${suffixes[i]} |`)
    .reduce((acc, field) => acc + field, "|");

const _addDataRow = argv =>
  Object.assign({}, argv, {
    md: argv.md.concat([_reduceDataRow(argv)]),
  });

module.exports = {
  _addDataRow,
  _addHeader,
  _addMochawesomeJson,
  _addUnderlineRow,
  _defaults,
  _isUndefinedOrArray,
  _minimistCreator,
  _minimistTestableCreator,
  _reduceDataRow,
  _reduceHeaders,
  _reduceUnderlineRow,
  _setDefaults,
};
