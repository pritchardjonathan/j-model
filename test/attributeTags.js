var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Attribute tagging", function() {

  it("Should disable all but those attributes tagged with one or more the tags provided to the model constructor", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String, tags: [ "public", "admin" ]},
          { name: "email", type: String, tags: [ "private", "admin" ]}
        ]
      }),
      u1 = new User({ name: "John Doe", email: "john.doe@google.com" },[ "public" ]);

    assert.equal(u1.name, "John Doe");
    assert.equal(typeof u1.email, "undefined");
    assert.equal(JSON.stringify(u1), "{\"name\":\"John Doe\"}");

    u1.email = "john.doe@google.com";

    assert.equal(typeof u1.email, "undefined");
    assert.equal(JSON.stringify(u1), "{\"name\":\"John Doe\"}");

  });

  it("Should enable all attributes when no tags are provided to the model constructor", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String, tags: [ "public", "admin" ]},
          { name: "email", type: String, tags: [ "private", "admin" ]}
        ]
      }),
      u1 = new User({ name: "John Doe", email: "john.doe@google.com" });

    assert.equal(u1.name, "John Doe");
    assert.equal(u1.email, "john.doe@google.com");
    assert.equal(JSON.stringify(u1), "{\"name\":\"John Doe\",\"email\":\"john.doe@google.com\"}");

  });

  it("Should allow attributes to be filtered by tag by supplying one or more filter tags to the .toJSON() method", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String, tags: [ "public", "admin" ]},
          { name: "email", type: String, tags: [ "private", "admin" ]},
          { name: "dateOfBirth", type: String, tags: [ "private", "personal" ]}
        ]
      }),
      u1 = new User({ name: "John Doe", email: "john.doe@google.com", dateOfBirth: new Date(0) });

    assert.equal(u1.name, "John Doe");
    assert.equal(u1.email, "john.doe@google.com");
    assert.equal(JSON.stringify(u1.toJSON("public")), "{\"name\":\"John Doe\"}");

    assert.equal(u1.name, "John Doe");
    assert.equal(u1.email, "john.doe@google.com");
    assert.equal(JSON.stringify(u1.toJSON("public", "personal")), "{\"name\":\"John Doe\",\"dateOfBirth\":\"Thu Jan 01 1970 00:00:00 GMT+0000 (GMT)\"}");

  });

  it("Should combine filter tags supplied to the constructor with those provided to the .toJSON() method", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String, tags: [ "public", "admin" ]},
          { name: "email", type: String, tags: [ "private", "admin" ]},
          { name: "dateOfBirth", type: String, tags: [ "private, personal" ]}
        ]
      }),
      u1 = new User({ name: "John Doe", email: "john.doe@google.com", dateOfBirth: new Date(0) }, [ "admin" ]);

    assert.equal(u1.name, "John Doe");
    assert.equal(u1.email, "john.doe@google.com");
    assert.equal(JSON.stringify(u1.toJSON("public")), "{\"name\":\"John Doe\",\"email\":\"john.doe@google.com\"}");

  });

});