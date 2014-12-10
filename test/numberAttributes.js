var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Number attributes", function() {
  it("Should accept attribute configuration where the type is supplied as the constructor function", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "age", type: Number }
        ]
      }),
      u1 = new User();

    u1.age = 1;

    assert.equal(typeof u1.age, "number");
  });
  it("Should accept attribute configuration where the type is supplied as a string", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "age", type: "number" }
        ]
      }),
      u1 = new User();

    u1.age = 1;

    assert.equal(typeof u1.age, "number");
  });
  it("Should accept and convert a string value for a number attribute", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "age", type: "number" }
        ]
      }),
      u1 = new User();

    u1.age = "1";

    assert.equal(typeof u1.age, "number");
  });
  it("Should accept and convert a date value", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "age", type: "number" }
        ]
      }),
      u1 = new User();

    u1.age = new Date();

    assert.equal(typeof u1.age, "number");
  });
  it("Should accept and convert an invalid string value to NaN", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "age", type: "number" }
        ]
      }),
      u1 = new User();

    u1.age = "blah";

    assert.equal(isNaN(u1.age), true);
  });
  it("Should accept and convert a string value, containing a '.' char, into a float", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "age", type: "number" }
        ]
      }),
      u1 = new User();

    u1.age = "1.6";

    assert.equal(u1.age === parseFloat(u1.age), true);
  });
  it("Should accept and convert a string value, not containing a '.' char, into an integer", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "age", type: "number" }
        ]
      }),
      u1 = new User();

    u1.age = "1";

    assert.equal(u1.age === parseInt(u1.age), true);
  });
});