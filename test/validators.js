var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Model validators", function() {

  describe("Synchronous attribute validator", function(){

    it("Should complete by returning true or false to indicate validity", function () {
      var User = jModel.create("User", {
          attributes: [
            { name: "name", type: String, validators: [
              function(value, result){
                if(!value){
                  result.addMessage("A name is required");
                  return false;
                } else return true;
              }
            ]}
          ]
        }),
        u1 = new User();

      jModel.validate(u1, function(err, validationResult){
        assert.equal(validationResult.valid, false);
        assert.equal(validationResult.attribute.valid, false);
        assert.equal(validationResult.attribute.messages.length, 1);
        assert.equal(validationResult.attribute.messages[0].name, "name");
        assert.equal(validationResult.attribute.messages[0].message, "A name is required");
      });
    });

  });

  describe("Asynchronous attribute validator", function(){

    it("Should complete by calling the result.done(...) with true or false to indicate validity", function (done) {
      var User = jModel.create("User", {
          attributes: [
            { name: "name", type: String, validators: [
              function(value, result){
                setTimeout(function(){
                  if(!value){
                    result.addMessage("A name is required");
                    result.done(false);
                  } else result.done(true);
                }, 2000);
              }
            ]}
          ]
        }),
        u1 = new User();

      jModel.validate(u1, function(err, validationResult){
        assert.equal(validationResult.valid, false);
        assert.equal(validationResult.attribute.valid, false);
        assert.equal(validationResult.attribute.messages.length, 1);
        assert.equal(validationResult.attribute.messages[0].name, "name");
        assert.equal(validationResult.attribute.messages[0].message, "A name is required");
        done();
      });
    });

  });

  describe("Synchronous global model validator", function(){

    it("Should complete by returning true or false to indicate validity", function(done){
      var User = jModel.create("User", {
          attributes: [
            { name: "name", type: String },
            { name: "email", type: String },
            { name: "admin", type: Boolean }
          ],
          validators: [
            { name: "Admin user email required", fn: function(model, result){
              if(model.admin && !model.email){
                result.addMessage("Admin users must have an email address");
                return false;
              }
              return true;
            }}
          ]
        }),
        u1 = new User({ admin: true });

      jModel.validate(u1, function(err, validationResult){
        assert.equal(validationResult.valid, false);
        assert.equal(validationResult.global.valid, false);
        assert.equal(validationResult.global.messages.length, 1);
        assert.equal(validationResult.global.messages[0].name, "Admin user email required");
        assert.equal(validationResult.global.messages[0].message, "Admin users must have an email address");
        done();
      });
    });

  });

  describe("Asynchronous global model validator", function(){

    it("Should complete by calling the result.done(...) with true or false to indicate validity", function(done){
      var User = jModel.create("User", {
          attributes: [
            { name: "name", type: String },
            { name: "email", type: String },
            { name: "admin", type: Boolean }
          ],
          validators: [
            { name: "Admin user email required", fn: function(model, result){
              setTimeout(function() {
                if (model.admin && !model.email) {
                  result.addMessage("Admin users must have an email address");
                  result.done(false);
                }
                result.done(true);
              });
            }}
          ]
        }),
        u1 = new User({ admin: true });

      jModel.validate(u1, function(err, validationResult){
        assert.equal(validationResult.valid, false);
        assert.equal(validationResult.global.valid, false);
        assert.equal(validationResult.global.messages.length, 1);
        assert.equal(validationResult.global.messages[0].name, "Admin user email required");
        assert.equal(validationResult.global.messages[0].message, "Admin users must have an email address");
        done();
      });
    });

  });

  describe("Inbuilt email validator", function(){

    it("Should fail validation with the correct message when an invalid email is passed in", function(done){
      var User = jModel.create("User", {
          attributes: [
            { name: "email", type: String, validators:[ jModel.validators.email("Please supply a valid email address") ] }
          ]
        }),
        u1 = new User({ email: "foo@bar" });

      jModel.validate(u1, function(err, validationResult){
        assert.equal(validationResult.valid, false);
        assert.equal(validationResult.attribute.valid, false);
        assert.equal(validationResult.attribute.messages.length, 1);
        assert.equal(validationResult.attribute.messages[0].name, "email");
        assert.equal(validationResult.attribute.messages[0].message, "Please supply a valid email address");
        done();
      });

    });

  });

  describe("Inbuilt min validator", function(){

    it("Should fail validation with the correct message when a value smaller than the defined minimum is found", function(done){
      var User = jModel.create("User", {
          attributes: [
            { name: "age", type: String, validators:[ jModel.validators.min(10, "User must be at least 10 years old") ] }
          ]
        }),
        u1 = new User();

      jModel.validate(u1, function(err, validationResult){
        assert.equal(validationResult.valid, false);
        assert.equal(validationResult.attribute.valid, false);
        assert.equal(validationResult.attribute.messages.length, 1);
        assert.equal(validationResult.attribute.messages[0].name, "age");
        assert.equal(validationResult.attribute.messages[0].message, "User must be at least 10 years old");
        done();
      });

    });

  });

  describe("Inbuilt max validator", function(){

    it("Should fail validation with the correct message when a value larger than the defined maximum is found", function(done){
      var User = jModel.create("User", {
          attributes: [
            { name: "age", type: String, validators:[ jModel.validators.max(120, "No person has ever lived more than 120 years") ] }
          ]
        }),
        u1 = new User({ age: 130 });

      jModel.validate(u1, function(err, validationResult){
        assert.equal(validationResult.valid, false);
        assert.equal(validationResult.attribute.valid, false);
        assert.equal(validationResult.attribute.messages.length, 1);
        assert.equal(validationResult.attribute.messages[0].name, "age");
        assert.equal(validationResult.attribute.messages[0].message, "No person has ever lived more than 120 years");
        done();
      });

    });

  });

  describe("Inbuilt range validator", function(){

    it("Should fail validation with the correct message when values outside the defined range are found", function(done){
      var User = jModel.create("User", {
          attributes: [
            { name: "age1", type: Number, validators:[ jModel.validators.range(10, 20, "User age must be between 10 and 20") ] },
            { name: "age2", type: Number, validators:[ jModel.validators.range(10, 20, "User age must be between 10 and 20") ] },
            { name: "age3", type: Number, validators:[ jModel.validators.range(10, 20, "User age must be between 10 and 20") ] }
          ]
        }),
        u1 = new User({ age1: 9, age2: 10, age3: 21 });

      jModel.validate(u1, function(err, u1ValidationResult){
        assert.equal(u1ValidationResult.valid, false);
        assert.equal(u1ValidationResult.attribute.valid, false);
        assert.equal(u1ValidationResult.attribute.messages.length, 2);
        assert.equal(u1ValidationResult.attribute.messages[0].name, "age1");
        assert.equal(u1ValidationResult.attribute.messages[0].message, "User age must be between 10 and 20");
        assert.equal(u1ValidationResult.attribute.messages[1].name, "age3");
        assert.equal(u1ValidationResult.attribute.messages[1].message, "User age must be between 10 and 20");
        done();
      });

    });

  });

  describe("Inbuilt minLength array validator", function(){

    it("Should fail with the correct message when a null value or an array of shorter length than the defined minimum is found", function(done){
      var User = jModel.create("User", {
          attributes: [
            { name: "roles", type: [ String ], validators:[ jModel.validators.minLength(0, "User must have at least one role") ] }
          ]
        }),
        u1 = new User();

      jModel.validate(u1, function(err, validationResult){
        assert.equal(validationResult.valid, false);
        assert.equal(validationResult.attribute.valid, false);
        assert.equal(validationResult.attribute.messages.length, 1);
        assert.equal(validationResult.attribute.messages[0].name, "roles");
        assert.equal(validationResult.attribute.messages[0].message, "User must have at least one role");
        done();
      });

    });

  });

  describe("Inbuilt maxLength array validator", function(){

    it("Should fail with the correct message when an array of higher length than the defined maximum is found", function(done){
      var User = jModel.create("User", {
          attributes: [
            { name: "roles", type: [ String ], validators:[ jModel.validators.maxLength(3, "User cannot have more than 3 roles") ] }
          ]
        }),
        u1 = new User({ roles: [ "foo", "bar", "hello", "world"] });

      jModel.validate(u1, function(err, validationResult){
        assert.equal(validationResult.valid, false);
        assert.equal(validationResult.attribute.valid, false);
        assert.equal(validationResult.attribute.messages.length, 1);
        assert.equal(validationResult.attribute.messages[0].name, "roles");
        assert.equal(validationResult.attribute.messages[0].message, "User cannot have more than 3 roles");
        done();
      });

    });

  });

  describe("Inbuilt lengthRange array validator", function(){

    it("Should fail with the correct message when an array of length outside the defined range is found ", function(done){
      var User = jModel.create("User", {
          attributes: [
            { name: "role1", type: [ Number ], validators:[ jModel.validators.lengthRange(1, 2, "User must have between 1 and 2 roles") ] },
            { name: "role2", type: [ Number ], validators:[ jModel.validators.lengthRange(1, 2, "User must have between 1 and 2 roles") ] },
            { name: "role3", type: [ Number ], validators:[ jModel.validators.lengthRange(1, 2, "User must have between 1 and 2 roles") ] }
          ]
        }),
        u1 = new User({
          role1: [ ],
          role2: [ 0 ],
          role3: [ 0, 0, 0 ]
        });

      jModel.validate(u1, function(err, u1ValidationResult){
        assert.equal(u1ValidationResult.valid, false);
        assert.equal(u1ValidationResult.attribute.valid, false);
        assert.equal(u1ValidationResult.attribute.messages.length, 2);
        assert.equal(u1ValidationResult.attribute.messages[0].name, "role1");
        assert.equal(u1ValidationResult.attribute.messages[0].message, "User must have between 1 and 2 roles");
        assert.equal(u1ValidationResult.attribute.messages[1].name, "role3");
        assert.equal(u1ValidationResult.attribute.messages[1].message, "User must have between 1 and 2 roles");
        done();
      });
    });
  });

  describe("Validation with tags", function(){
    it("Should only validate attributes with one or more tags when tags are supplied to the validate function", function(done){
      var User = jModel.create("User", {
          attributes: [
            {
              name: "role1",
              type: [ Number ],
              tags: [],
              validators:[ jModel.validators.lengthRange(1, 2, "User must have between 1 and 2 roles") ]
            },
            {
              name: "role2",
              type: [ Number ],
              tags: [ "update" ],
              validators:[ jModel.validators.lengthRange(1, 2, "User must have between 1 and 2 roles") ]
            },
            {
              name: "role3",
              type: [ Number ],
              tags: [ "update" ],
              validators:[ jModel.validators.lengthRange(1, 2, "User must have between 1 and 2 roles") ]
            }
          ]
        }),
        u1 = new User({
          role1: [ ],
          role2: [ 0 ],
          role3: [ 0, 0, 0 ]
        });

      jModel.validate(u1, [ "update" ], function(err, u1ValidationResult){
        assert.equal(u1ValidationResult.valid, false);
        assert.equal(u1ValidationResult.attribute.valid, false);
        assert.equal(u1ValidationResult.attribute.messages.length, 1);
        assert.equal(u1ValidationResult.attribute.messages[0].name, "role3");
        assert.equal(u1ValidationResult.attribute.messages[0].message, "User must have between 1 and 2 roles");
        done();
      });

      u1.role3 = [ 0, 0 ];

      jModel.validate(u1, [ "update" ], function(err, u1ValidationResult){
        assert.equal(u1ValidationResult.valid, true);
        assert.equal(u1ValidationResult.attribute.valid, true);
        assert.equal(u1ValidationResult.attribute.messages.length, 0);
        done();
      });

    })
  })

});
