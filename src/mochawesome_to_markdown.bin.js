const Ajv = require("ajv");
const path = require("path");

const {
  _minimistCreator,
  _setDefaults,
  _addMochawesomeJson,
  _addHeader,
  _addUnderlineRow,
  _addDataRow,
} = require("./mochawesome_to_markdown");

let validator;

try {
  validator = require("../gen/validator");
} catch (ex) {
  const ajv = new Ajv();
  validator = ajv.compile(require("./schema"));
}

const _ERROR_CODES = {
  PASS: 0,
  FATAL: -1,
  USAGE: -2,
};

const _checkUsage = argv => {
  if (argv["help"]) {
    return Promise.reject({
      exitCode: _ERROR_CODES.USAGE,
    });
  }

  if (!validator(argv)) {
    return Promise.reject({
      exitCode: _ERROR_CODES.USAGE,
      errors: validator.errors,
    });
  }

  return argv;
};

const _checkLengths = argv => {
  const errors = ["fields", "prefixes", "suffixes"]
    .map(
      field =>
        argv["headers"].length === argv[field].length
          ? null
          : `headers and ${field} must be the same length`
    )
    .filter(x => x);

  if (errors.length > 0) {
    return Promise.reject({
      exitCode: _ERROR_CODES.USAGE,
      errors,
    });
  }

  return argv;
};

const _splitArrays = argv =>
  Object.assign(
    {},
    argv,
    ["fields", "headers", "prefixes", "suffixes"]
      .filter(inp => argv[inp])
      .map(inp => ({ inp, data: argv[inp].split(",") }))
      .reduce((acc, each) => {
        acc[each.inp] = each.data;

        return acc;
      }, {})
  );

const _usage = logFn => {
  const bn = path.basename(process.argv[1]);

  [
    `Usage ${bn}:`,
    `  Notes:`,
    `    * count of fields and headers must be the same (6 by default)`,
    `    * suffixes and prefixes will each be ignored unless they`,
    `      are each the same length as fields and headers.`,
    `  ${bn} --mochawesome=<file> [--fields=x,y,z] [--headers=x,y,z] [--prefixes=x,y,z] [--suffixes=x,y,z]`,
    `  ${bn} --mochawesome=mochawesome.json`,
    `  ${bn} --mochawesome=mochawesome.json --headers=Pass%,Pass,Fail,Skip,Total,Time`,
  ].forEach(ea => logFn(ea));
};

const _mochawesomeToMarkdownTestableCreator = _minimistCreator => logFn => args => {
  return Promise.resolve(args)
    .then(_minimistCreator({ boolean: ["help"] }))
    .then(_splitArrays)
    .then(_checkUsage)
    .then(_setDefaults)
    .then(_addMochawesomeJson)
    .then(_checkLengths)
    .then(argv => Object.assign({}, argv, { md: [] }))
    .then(_addHeader)
    .then(_addUnderlineRow)
    .then(_addDataRow)
    .then(({ md }) => md.join("\n"))
    .then(md => logFn(md))
    .catch(error => {
      if (error.exitCode !== undefined) {
        if (error.errors !== undefined) {
          logFn(JSON.stringify(error.errors, null, 2));
        }

        if (error.exitCode === _ERROR_CODES.USAGE) {
          _usage(logFn);
        }

        return error.exitCode;
      }

      logFn(error);

      return _ERROR_CODES.FATAL;
    })
    .then(exitCode => exitCode || _ERROR_CODES.PASS);
};

const _mochawesomeToMarkdownCreator = _mochawesomeToMarkdownTestableCreator(
  _minimistCreator
);

const mochawesomeToMarkdown = _mochawesomeToMarkdownCreator(console.log);

module.exports = {
  _ERROR_CODES,
  _mochawesomeToMarkdownTestableCreator,
  _mochawesomeToMarkdownCreator,
  mochawesomeToMarkdown,
};
