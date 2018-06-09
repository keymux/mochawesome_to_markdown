const { expect } = require("chai");
const { readFilePromise, writeFilePromise } = require("@keymux/promisrfs");
const { spy } = require("sinon");

const path = require("path");

const {
  _ERROR_CODES,
  _mochawesomeToMarkdownCreator,
  _mochawesomeToMarkdownTestableCreator,
} = require("../../src/mochawesome_to_markdown.bin");

describe("mochawesome_to_markdown.bin.js", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = spy();
  });

  expectUsageInLogSpy = inp => {
    expect(logSpy.args[logSpy.args.length - 1]).to.match(/^Usage/);

    return inp;
  };

  // Rather than directory parsing, rely on a consistent filename for
  // test fixtures
  [1]
    .map(x => `static/mochawesome.${x}`)
    .map(x => ({
      mochawesomeFile: path.resolve(`${x}.json`),
      mochawesomeMd: path.resolve(`${x}.md`),
    }))
    // Now we have our test fixtures
    .forEach(fixture => {
      describe("given a mochawesome file", () => {
        const { mochawesomeFile, mochawesomeMd } = fixture;

        let mochawesomeToMarkdown;

        beforeEach(() => {
          mochawesomeToMarkdown = _mochawesomeToMarkdownCreator(logSpy);
        });

        describe("and arguments to load it", () => {
          const args = ["--mochawesome", mochawesomeFile];

          describe("with the default configuration", () => {
            let expected;

            beforeEach(() => {
              return readFilePromise(fixture.mochawesomeMd).then(
                result => (expected = result.toString())
              );
            });

            it("should produce the expected output", () => {
              return mochawesomeToMarkdown(args).then(exitCode => {
                expect(exitCode).to.equal(_ERROR_CODES.PASS);

                expect(logSpy.calledOnce).to.be.true;

                const actual = logSpy.args.pop().pop();
                expect(actual).to.equal(expected);
              });
            });
          });
        });
      });
    });

  describe("_mochawesomeToMarkdownTestableCreator()", () => {
    describe("curries to _mochawesomeToMarkdownCreator()", () => {
      const _getMochawesomeToMarkdownCreator = minimistCreatorMock =>
        _mochawesomeToMarkdownTestableCreator(minimistCreatorMock);

      describe("curries to _mochawesomeToMarkdown()", () => {
        it("should return a fatal exitCode if there is an unexpected error", () => {
          const mochawesomeToMarkdown = _getMochawesomeToMarkdownCreator(
            () => () => Promise.reject(new Error("Test error"))
          )(logSpy);

          return mochawesomeToMarkdown({}).then(exitCode =>
            expect(exitCode).to.equal(_ERROR_CODES.FATAL)
          );
        });

        it("should reject with a custom error code if a function implements it", () => {
          const customExitCode = 35;

          const mochawesomeToMarkdown = _getMochawesomeToMarkdownCreator(
            () => () => Promise.reject({ exitCode: customExitCode })
          )(logSpy);

          return mochawesomeToMarkdown({}).then(exitCode =>
            expect(exitCode).to.equal(customExitCode)
          );
        });
      });

      describe("if the validator were to fail", () => {
        it("should error out with a usage statement", () => {
          const mochawesomeToMarkdown = _getMochawesomeToMarkdownCreator(
            () => () => ({ mochawesome: 2 })
          )(logSpy);

          return mochawesomeToMarkdown({}).then(exitCode =>
            expect(exitCode).to.equal(_ERROR_CODES.USAGE)
          );
        });
      });
    });
  });

  describe("_mochawesomeToMarkdownCreator()", () => {
    let mochawesomeToMarkdown;

    beforeEach(() => {
      mochawesomeToMarkdown = _mochawesomeToMarkdownCreator(logSpy);
    });

    it("should print usage if there is a usage error", () => {
      return mochawesomeToMarkdown([
        "--mochawesome",
        "static/mochawesome.1.json",
        "--fields",
        "bla",
        "--headers",
        "bla,bla2",
      ]).then(exitCode => {
        expect(exitCode).to.equal(_ERROR_CODES.USAGE);
      });
    });

    it("should still report properly with defined parameters", () => {
      return mochawesomeToMarkdown([
        "--mochawesome",
        "static/mochawesome.1.json",
        "--fields",
        "passPercent,duration",
        "--headers",
        "Pass (%),Time (ms)",
        "--prefixes",
        ",",
        "--suffixes",
        ",",
      ]).then(exitCode => {
        expect(exitCode).to.equal(_ERROR_CODES.PASS);
      });
    });

    it("should print usage when provided with --help", () => {
      return mochawesomeToMarkdown(["--help"]).then(exitCode => {
        expect(exitCode).to.equal(_ERROR_CODES.USAGE);
      });
    });
  });
});
