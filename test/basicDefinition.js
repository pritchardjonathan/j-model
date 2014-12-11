var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Basic definition", function() {
  it("Should create a constructor object for a model", function () {
    var NewModel = jModel.create("NewModel", {});
    assert.equal(typeof NewModel, "function");
  });
  it("Should accept a text-only 'attribute' configuration and assume the type of the value provided", function () {
    var User = jModel.create("User", {
        attributes: [
          "name"
        ]
      }),
      u1 = new User();

    u1.name = 1;

    assert.equal(typeof u1.name, "number");
  });
  it("Should accept and convert attribute data passed in the model constructor", function () {
    var User = jModel.create("User", {
      attributes:[
        { name: "name", type: String },
        { name: "age", type: Number },
        { name: "dateOfBirth", type: Date },
        { name: "admin", type: Boolean },
        { name: "roles", type: [ String ] }
      ]
    }),
      u1 = new User({
        name: 1,
        age: "100",
        dateOfBirth: "2013-02-08 09:30:26.123",
        admin: "true",
        roles:[ 1, new Date(0), true ]
      });

    assert.equal(u1.name, 1);
    assert.equal(u1.age, 100);
    assert.equal(u1.dateOfBirth.getTime(), 1360315826123);
    assert.equal(u1.admin, true);
    assert.equal(u1.roles[0], [ "1" ]);
    assert.equal(u1.roles[1], [ "Thu Jan 01 1970 00:00:00 GMT+0000 (GMT)" ]);
    assert.equal(u1.roles[2], [ "true" ]);
  });
});