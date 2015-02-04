var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Tag Filter Overlay", function() {

  it("Should apply values of tagged attributes only to destination model", function(){
    var
      User = jModel.create("User", {
        attributes:[
          { name: "name", type: String, tags: [ "public" ] },
          { name: "password", type: String, tags: [ "private" ]}
        ]
      }),
      u1 = new User({ name: "John Doe", password: "something secret" }),
      u2 = new User({ name: "Jane Doe", password: "new password" });

    jModel.filter.overlay(u2, u1, [ "public" ]);

    assert.equal(u1.name, "Jane Doe");
    assert.equal(u1.password, "something secret");

  });

});