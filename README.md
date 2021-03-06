JModel - Simple NodeJS Models
=======

Inspired by nodejs-model (https://github.com/asaf/nodejs-model), JModel is a library
designed to help with the definition, validation and filtering of models in your NodeJS
application.

# Why use JModel
JModel helps you define and enforce the attributes of your models. It also provides some
low-level utilities for common functionality such as model validation and property
filtering. This library is highly extensible and default behaviour can be added to or
overwritten if it doesn't meet your needs.

# Installation

To install j-model, use [npm](http://github.com/isaacs/npm):

```bash
$ npm install j-model --save
```

# Usage Overview

This is how it works:

``` javascript
var Address = jModel.create("Address", {
        attributes: [
          { name: "firstLine", type: String },
          { name: "secondLine", type: String },
          { name: "city", type: String },
          { name: "postcode", type: String }
        ]
      });
var User = jModel.create("User", {
      attributes: [
        {
          name: "name",
          type: String,
          tags: [ "public", "authenticated" ],
          validators: [
            function(value, result){
              if(value.indexOf(" ") === -1){
                result.addMessage("Name must include both forename and surname");
                return false;
              } else return true;
            }
          ]
        },
        {
          name: "email",
          type: String,
          tags: [ "authenticated" ],
          validators:[
            jModel.validators.email("Please supply a valid email address")
          ]
        },
        { name: "dateOfBirth", type: Date, tags: [ "authenticated" ] },
        { name: "admin", type: Boolean, tags: [ "public" ] },
        { name: "roles", type: [ String ], tags: [ "public" ] },
        { name: "addresses", type: [ Address ] }
        { name: "getRolesString", type: Function, fn: function(){
          return this.roles.join(", ");
        }
      ],
      init: function(constructorData){
        if(!constructorData.name) this.name = "John Doe";
        if(!constructorData.dateOfBirth) this.dateOfBirth = new Date(0);
      },
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
    });
var u1 = new User({ admin: true });

var limitedU1 = jModel.filter.reduce(u1, [ "public" ])

// limitedU1.name === "John Doe"
// limitedU1.dateOfBirth === undefined

limitedU1 = jModel.filter.reduce(u1, [ "authenticated" ])

// limitedU1.name === "John Doe"
// limitedU1.dateOfBirth === new Date(0)

jModel.validate(u1, function(result){
  // result.valid === false
  // result.global.valid === false
  // result.global.messages[0].name === "Admin user email required"
  // result.global.messages[0].message = "Admin users must have an email address";
});

u1.email = "bad email @ddress";

jModel.validate(u1, function(result){
  // result.valid === false
  // result.attribute.valid === false
  // result.attribute.messages[0].name === "email"
  // result.attribute.messages[0].message = "Please supply a valid email address";
});

// Validate "public" (tagged) attribute values only
jModel.validate(u1, [ "public" ], function(result){
  // result.valid === true
  // result.attribute.valid === true
});

u1.name = "John";

jModel.validate(u1, function(result){
  // result.valid === false
  // result.attribute.valid === false
  // result.attribute.messages[0].name === "name"
  // result.attribute.messages[0].message = "Name must include both forename and surname";
});

// Serialises to a normal object
// JSON.stringify(u1) === "{"name":"John","admin":true}"

```

# Model Tag Filtering
Use the jModel.filter.reduce() function to project a limited version of the model.

``` javascript
var User = jModel.create("User", {
    attributes: [
      { name: "name", type: String, tags: [ "public", "admin" ]},
      { name: "email", type: String, tags: [ "private", "admin" ]}
    ]
  }),
  u1 = new User({ name: "John Doe", email: "john.doe@google.com" }),
  filteredU1 = jModel.filter.reduce(u1, [ "public" ]);

assert.equal(filteredU1.name, "John Doe");
assert.equal(typeof filteredU1.email, "undefined");
```

# Nested Model Tag Filtering

``` javascript
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
```

# Custom types
Teach it about new types:

``` javascript
var User, u1;
jModel.converterFactory.registerConverter("customExample", function(value, attribute){
  // Transform the value if necessary
  return value.b;
});

User = jModel.create("User", {
    attributes: [
      { name: "name", type: String },
      { name: "foo", type:"customExample" }
    ]
  });

u1 = new User({ name: "John Doe", foo: { b: "bar" } });
assert.equal(u1.foo, "bar");
u1.foo = { b: "foo" };
assert.equal(u1.foo, "foo");
```
# To-do

* Enums
* Aliases