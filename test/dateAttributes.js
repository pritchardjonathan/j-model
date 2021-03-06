var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Date attributes", function() {
  it("Should accept attribute configuration where the type is supplied as the constructor function", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "dateOfBirth", type: Date }
        ]
      }),
      u1 = new User();

    u1.dateOfBirth = new Date();

    assert.equal(u1.dateOfBirth instanceof Date, true);
  });
  it("Should accept attribute configuration where the type is supplied as a string", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "dateOfBirth", type: "date" }
        ]
      }),
      u1 = new User();

    u1.dateOfBirth = new Date();

    assert.equal(u1.dateOfBirth instanceof Date, true);
  });
  it("Should accept and convert a string date value conforming to ISO 8601 standards", function(){
    // Refer to http://momentjs.com/docs/#/parsing/
    var User = jModel.create("User", {
        attributes: [
          { name: "dateOfBirth", type: Date }
        ]
      }),
      u1 = new User();

    u1.dateOfBirth = "2013-02-08 09:30:26.123";

    assert.equal(u1.dateOfBirth instanceof Date, true);
    assert.equal(u1.dateOfBirth.getTime(), 1360315826123);
  });
  it("Should accept and convert an invalid string date value to null", function(){
    // Refer to http://momentjs.com/docs/#/parsing/
    var User = jModel.create("User", {
        attributes: [
          { name: "dateOfBirth", type: Date }
        ]
      }),
      u1 = new User();

    u1.dateOfBirth = "blah blah blah";

    assert.equal(u1.dateOfBirth, null);
  });
  it("Should accept and convert string dates in an alternative format", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "dateOfBirth", type: Date, dateFormat: "DD-MM-YYYY" }
        ]
      }),
      u1 = new User();

    u1.dateOfBirth = "12-02-1995";

    assert.equal(u1.dateOfBirth.toString(), "Sun Feb 12 1995 00:00:00 GMT+0000 (GMT)");
  });
  it("Should accept undefined or null and convert to null when no dateFormat is specified", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "dateOfBirth", type: Date }
        ]
      }),
      u1 = new User({dateOfBirth: undefined});

    assert.equal(u1.dateOfBirth, null);

    u1.dateOfBirth = {}.blah;

    assert.equal(u1.dateOfBirth, null);

    u1.dateOfBirth = null;

    assert.equal(u1.dateOfBirth, null);
  });
});