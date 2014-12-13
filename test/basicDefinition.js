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

  it("Should run an initialisation function if supplied on create", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String }
        ],
        init: function(){
          this.name = "John Doe";
        }
      }),
      u1;

    u1 = new User();

    assert.equal(u1.name, "John Doe");
  });

  it("Should expose a helper method when defined using the Function object for type", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String },
          { name: "getLowerCaseName", type: Function, fn: function(){
            return this.name.toLowerCase();
          }}
        ]
      }),
      u1;

    u1 = new User({ name: "John Doe" });

    assert.equal(u1.getLowerCaseName(), "john doe");
  });

  it("Should accept a model instance in it's constructor as initialisation data", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String }
        ]
      }),
      u1,
      u2;

    u1 = new User({ name: "John Doe" });
    u2 = new User(u1);

    assert.equal(u2.name, "John Doe");
  });

});


