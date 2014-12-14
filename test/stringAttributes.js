var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("String attributes", function() {
  it("Should accept attribute configuration where the type is supplied as the constructor function", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String }
        ]
      }),
      u1 = new User();

    u1.name = "John";

    assert.equal(u1.name, "John");
  });
  it("Should accept attribute configuration where the type is supplied as a string", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: "string" }
        ]
      }),
      u1 = new User();

    u1.name = 1;

    assert.equal(u1.name, "1");
  });
  it("Should accept and convert a number value for a string attribute", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: "string" }
        ]
      }),
      u1 = new User();

    u1.name = 1;

    assert.equal(u1.name, "1");
  });
  it("Should accept and convert a date value", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: "string" }
        ]
      }),
      u1 = new User();

    u1.name = new Date(0);

    assert.equal(u1.name, "Thu Jan 01 1970 00:00:00 GMT+0000 (GMT)");
  });
  it("Should accept and convert an undefined value to an empty string", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: "string" }
        ]
      }),
      u1 = new User();

    u1.name = undefined;

    assert.equal(u1.name, "");
  });
  it("Should accept and convert a null value to an empty string", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: "string" }
        ]
      }),
      u1 = new User();

    u1.name = null;

    assert.equal(u1.name, "");
  });
});