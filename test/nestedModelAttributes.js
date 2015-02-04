var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Nested model attributes", function() {

  it("Should accept a single nested model type", function () {
    var Address = jModel.create("Address", {
        attributes: [
          { name: "firstLine", type: String },
          { name: "secondLine", type: String },
          { name: "city", type: String },
          { name: "postcode", type: String }
        ]
      }),
      User = jModel.create("User", {
        attributes: [
          { name: "roles", type: [ String ] },
          { name: "address", type: Address }
        ]
      }),
      u1 = new User({ address:{
        firstLine: "123 Somelane"
      }});

    assert.equal(u1.address.firstLine, "123 Somelane");
    assert.equal(u1.address.jModel.getName(), "Address");
  });



});