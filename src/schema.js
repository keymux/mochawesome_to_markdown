module.exports = {
  type: "object",
  properties: {
    mochawesome: {
      type: "string",
    },
    fields: {
      type: "array",
      items: {
        type: "string",
      },
    },
    headers: {
      type: "array",
      items: {
        type: "string",
      },
    },
    prefixes: {
      type: "array",
      items: {
        type: "string",
      },
    },
    suffixes: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["mochawesome"],
};
