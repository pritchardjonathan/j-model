var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Tag Filter Reduce", function() {

  it("Should remove all but those model attributes tagged with the specified tag(s)", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String, tags: [ "public", "admin" ]},
          { name: "email", type: String, tags: [ "private", "admin" ]}
        ]
      }),
      u1 = new User({ name: "John Doe", email: "john.doe@google.com" }),
      filteredU1 = jModel.filter(u1, [ "public" ]);

    assert.equal(filteredU1.name, "John Doe");
    assert.equal(typeof filteredU1.email, "undefined");

  });

  it("Should not remove any attributes when no tags are provided", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String, tags: [ "public", "admin" ]},
          { name: "email", type: String, tags: [ "private", "admin" ]}
        ]
      }),
      u1 = new User({ name: "John Doe", email: "john.doe@google.com" }),
      filteredU1 = jModel.filter(u1, [ ]);

    assert.equal(u1.name, "John Doe");
    assert.equal(u1.email, "john.doe@google.com");
    assert.equal(JSON.stringify(u1), "{\"name\":\"John Doe\",\"email\":\"john.doe@google.com\"}");
  });

  it("Should apply the same attribute filtering to nested models as applied to the parent", function () {
    var Address = jModel.create("Address", {
        attributes:[
          { name: "firstLine", type: String },
          { name: "postcode", type: String, tags: [ "public" ] }
        ]
      }),
      User = jModel.create("User", {
        attributes:[
          { name: "name", type: String, tags: [ "public" ] },
          { name: "primaryAddress", type: Address, tags: [ "public" ] },
          { name: "additionalAddresses", type: [ Address ], tags: [ "public" ]}
        ]
      }),
      u1 = new User(),
      filteredU1;

    u1.name = "John Doe";
    u1.primaryAddress = new Address({
      firstLine: "first line of primary address",
      postcode: "primary postcode"
    });
    u1.additionalAddresses = [
      new Address({
        firstLine: "first line of first additional address",
        postcode: "additional postcode 1" }),
      new Address({
        firstLine: "first line of second additional address",
        postcode: "additional postcode 2" })
    ];

    filteredU1 = jModel.filter(u1, [ "public" ]);

    assert.equal(typeof filteredU1.primaryAddress.firstLine, "undefined");
    assert.equal(filteredU1.primaryAddress.postcode, "primary postcode");

    assert.equal(typeof filteredU1.additionalAddresses[0].firstLine, "undefined");
    assert.equal(filteredU1.additionalAddresses[0].postcode, "additional postcode 1");

    assert.equal(typeof filteredU1.additionalAddresses[1].firstLine, "undefined");
    assert.equal(filteredU1.additionalAddresses[1].postcode, "additional postcode 2");

  });

});