var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Basic definition", function() {
  it("Should create a constructor object for a model", function () {
    var NewModel = jModel.create("NewModel", {});
    assert.equal("function", typeof NewModel);
  });
  it("Should accept a text-only 'attribute' configuration and assume the type of the value provided", function () {
    var User = jModel.create("User", {
        attributes: [
          "name"
        ]
      }),
      u1 = new User();

    u1.name = 1;

    assert.equal("number", typeof u1.name);
  });
});