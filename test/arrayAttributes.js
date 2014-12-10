var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Array attributes", function() {
  it("Should accept an empty array as type", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "roles", type: [] }
        ]
      }),
      u1 = new User();

    u1.roles = [ "hello" ];
    assert.equal(Array.isArray(u1.roles), true);
    assert.equal(typeof u1.roles[0], "string");

    u1.roles = [ 1 ];
    assert.equal(Array.isArray(u1.roles), true);
    assert.equal(typeof u1.roles[0], "number");

    u1.roles = [ true ];
    assert.equal(Array.isArray(u1.roles), true);
    assert.equal(typeof u1.roles[0], "boolean");

    u1.roles = [ {} ];
    assert.equal(Array.isArray(u1.roles), true);
    assert.equal(typeof u1.roles[0], "object");

  });
  it("Should accept a type wrapped in an array and enforce array item conversion", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "roles", type: [ String ] }
        ]
      }),
      u1 = new User();

    u1.roles = [ "hello" ];
    assert.equal(Array.isArray(u1.roles), true);
    assert.equal(typeof u1.roles[0], "string");

    u1.roles.push("hello");
    assert.equal(typeof u1.roles[1], "string");

    u1.roles = [ 1 ];
    assert.equal(Array.isArray(u1.roles), true);
    assert.equal(typeof u1.roles[0], "string");

    u1.roles.push(1);
    assert.equal(typeof u1.roles[1], "string");

    u1.roles = [ true ];
    assert.equal(Array.isArray(u1.roles), true);
    assert.equal(typeof u1.roles[0], "string");

    u1.roles.push(true);
    assert.equal(typeof u1.roles[1], "string");

    u1.roles = [ {} ];
    assert.equal(Array.isArray(u1.roles), true);
    assert.equal(typeof u1.roles[0], "string");


    u1.roles.push({});
    assert.equal(typeof u1.roles[1], "string");

  });
  it("Should accept and tolerate bad/empty value assignment", function() {
    var User = jModel.create("User", {
        attributes: [
          { name: "roles", type: [String] }
        ]
      }),
      u1 = new User();

    u1.roles = "hello";
    assert.equal(Array.isArray(u1.roles), true);
    assert.equal(u1.roles.length, 0);

    u1.roles = null;
    assert.equal(u1.roles, null);

  });
});