var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("JSON Serialisation", function () {
  it("Should serialise all types, including arrays, correctly", function () {
    var NewModel = jModel.create("NewModel", {});
    assert.equal("function", typeof NewModel);
  });

});