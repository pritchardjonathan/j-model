var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("JSON Serialisation", function () {
  it("Should serialise all types, including arrays, correctly", function () {
    var User = jModel.create("User", {
      attributes:[
        { name: "name", type: String },
        { name: "age", type: Number },
        { name: "dateOfBirth", type: Date },
        { name: "roles", type: [ String ] }
      ]
    });

    var u1 = new User();

    u1.name = "John Doe";
    u1.age = 21;
    u1.dateOfBirth = new Date(0);
    u1.roles = [ "cms", "editor", "premium" ];

    assert.equal(JSON.stringify(u1), '{"name":"John Doe","age":21,"dateOfBirth":"1970-01-01T00:00:00.000Z","roles":["cms","editor","premium"]}');
  });

});