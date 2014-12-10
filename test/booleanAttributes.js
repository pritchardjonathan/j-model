var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Boolean attributes", function() {
  it("Should accept attribute configuration where the type is supplied as the constructor function", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "admin", type: Boolean }
        ]
      }),
      u1 = new User();

    u1.admin = true;

    assert.equal("boolean", typeof u1.admin);
  });
  it("Should accept attribute configuration where the type is supplied as a string", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "admin", type: "boolean" }
        ]
      }),
      u1 = new User();

    u1.admin = false;

    assert.equal("boolean", typeof u1.admin);
  });
  it("Should accept and convert a string value 'true' to true", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "admin", type: "boolean" }
        ]
      }),
      u1 = new User();

    u1.admin = "true";

    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === true);
  });
  it("Should accept and convert a string value 'false' to false", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "admin", type: "boolean" }
        ]
      }),
      u1 = new User();

    u1.admin = "false";

    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === false);
  });
  it("Should accept and convert a falsy value to false", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "admin", type: "boolean" }
        ]
      }),
      u1 = new User();

    u1.admin = false;
    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === false);

    u1.admin = 0;
    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === false);

    u1.admin = "";
    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === false);

    u1.admin = null;
    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === false);

    u1.admin = undefined;
    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === false);

    u1.admin = NaN;
    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === false);
  });
  it("Should accept and convert a truthy value to true", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "admin", type: "boolean" }
        ]
      }),
      u1 = new User();

    u1.admin = true;
    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === true);

    u1.admin = "blah";
    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === true);

    u1.admin = 1;
    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === true);

    u1.admin = {};
    assert.equal("boolean", typeof u1.admin);
    assert.equal(true, u1.admin === true);
  });
});