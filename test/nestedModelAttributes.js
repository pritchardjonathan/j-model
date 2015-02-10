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
          { name: "address", type: Address },
          { name: "previousAddresses", type: [ Address ]}
        ]
      }),
      u1 = new User({ address:{
        firstLine: "123 Somelane"
      }});

    assert.equal(u1.address.firstLine, "123 Somelane");
    assert.equal(u1.address.jModel.getName(), "Address");



  });

  it("Should accept multiple nested model types", function () {
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
          { name: "previousAddresses", type: [ Address ]}
        ],
        init: function(){
          this.previousAddresses = [];
        }
      }),
      u1 = new User();

    u1.previousAddresses.push({ firstLine: "456 Anotherville" });

    assert.equal(u1.previousAddresses.length, 1);
    assert.equal(u1.previousAddresses[0].firstLine, "456 Anotherville")

  });



});