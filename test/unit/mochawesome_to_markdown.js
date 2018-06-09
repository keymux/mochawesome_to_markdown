const { expect } = require("chai");
const { stub } = require("sinon");

const uuid = require("uuid");

const {
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
} = require("../../src/mochawesome_to_markdown");

describe("mochawesome_to_markdown.js", () => {
  describe("_isUndefinedOrArray()", () => {
    const array = "array";
    const notDefined = "notDefined";
    const notArray = "notArray";

    const argv = {
      [array]: [],
      [notDefined]: undefined,
      [notArray]: {},
    };

    it("should return true if the property is undefined", () => {
      const actual = _isUndefinedOrArray(argv, notDefined);

      expect(actual).to.be.true;
    });

    it("should return true if the property is an array", () => {
      const actual = _isUndefinedOrArray(argv, array);

      expect(actual).to.be.true;
    });

    it("should return false if the propert is defined and not an array", () => {
      const actual = _isUndefinedOrArray(argv, notArray);

      expect(actual).to.be.false;
    });
  });

  describe("_minimistTestableCreator()", () => {
    let minimistResult;
    let minimistSpy;

    beforeEach(() => {
      minimistResult = uuid();
      minimistSpy = stub().returns(minimistResult);
    });

    it("should call minimist with the two curried arguments and return the result of minimist", () => {
      const arg1 = uuid();
      const arg2 = uuid();

      const actual = _minimistTestableCreator(minimistSpy)(arg2)(arg1);
      const expected = minimistResult;

      const expectedArgs = [[arg1, arg2]];

      expect(actual).to.equal(expected);

      expect(minimistSpy.args).to.deep.equal(expectedArgs);
    });
  });

  describe("_setDefaults()", () => {
    const allFields = () => ({
      fields: [uuid()],
      headers: [uuid()],
      prefixes: [uuid()],
      suffixes: [uuid()],
    });

    const deleteField = (obj, field) => {
      const o = Object.assign({}, obj);

      delete o[field];

      return o;
    };

    it("should override all defaults if all fields are provided", () => {
      const af = allFields();

      const actual = _setDefaults(af);
      const expected = af;

      expect(actual).to.deep.equal(expected);
    });

    it("should override only provided defaults if some fields are provided", () => {
      // Try this test for each field
      Object.keys(allFields()).forEach(field => {
        // Delete one field from a new allFields() result
        const someFields = deleteField(allFields(), field);

        const actual = _setDefaults(someFields);
        const expected = Object.assign({}, someFields, {
          [field]: _defaults[field],
        });

        expect(actual).to.deep.equal(expected);
      });
    });

    it("should just provide defaults if no fields are provided", () => {
      const actual = _setDefaults();
      const expected = _defaults;

      expect(actual).to.deep.equal(expected);
    });
  });
});
