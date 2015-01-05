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
    assert.equal(u1.address.getModelName(), "Address");
  });

  it("Should accept a tag filter property for the nested model type when nested model data is provided as a plain object", function () {
    var Address = jModel.create("Address", {
        attributes: [
          { name: "firstLine", type: String, tags: [ "short" ] },
          { name: "secondLine", type: String },
          { name: "city", type: String },
          { name: "postcode", type: String, tags: [ "short" ] }
        ]
      }),
      User = jModel.create("User", {
        attributes: [
          { name: "roles", type: [ String ] },
          { name: "address", type: Address, nestedModelTags: [ "short" ] }
        ]
      }),
      u1 = new User({ address:{
        firstLine: "123 Somelane",
        secondLine: "Whereville"
      }});

    assert.equal(u1.address.firstLine, "123 Somelane");
    assert.equal(typeof u1.address.secondLine, "undefined");
  });

  it("Should accept a tag filter property for the nested model type when nested model data is provided as a model object", function () {
    var Address = jModel.create("Address", {
        attributes: [
          { name: "firstLine", type: String, tags: [ "short" ] },
          { name: "secondLine", type: String },
          { name: "city", type: String },
          { name: "postcode", type: String, tags: [ "short" ] }
        ]
      }),
      User = jModel.create("User", {
        attributes: [
          { name: "roles", type: [ String ] },
          { name: "address", type: Address, nestedModelTags: [ "short" ] }
        ]
      }),
      u1 = new User({ address: new Address({
          firstLine: "123 Somelane",
          secondLine: "Whereville"
        })
      });

    assert.equal(u1.address.firstLine, "123 Somelane");
    assert.equal(typeof u1.address.secondLine, "undefined");
  });

});