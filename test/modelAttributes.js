var assert = require("assert"),
  jModel = require("../lib/j-model");

describe("Model attributes", function() {
  it("Should accept attribute configuration where the type is supplied as the constructor function", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String }
        ]
      }),
      Article = jModel.create("Article",{
        attributes: [
          { name: "title", type: String },
          { name: "author", type: User }
        ]
      }),
      article = new Article({ title: "The quick brown fox", author: { name: "John Doe" }});

    assert.equal(article.author.getModelName(), "User");
  });
  it("Should accept attribute configuration where the type is supplied as a string", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String }
        ]
      }),
      Article = jModel.create("Article",{
        attributes: [
          { name: "title", type: String },
          { name: "author", type: "User" }
        ]
      }),
      article = new Article({ title: "The quick brown fox", author: { name: "John Doe" }});

    assert.equal(article.author.getModelName(), "User");
  });
  it("Should accept a null value passed into the constructor", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String }
        ]
      }),
      Article = jModel.create("Article",{
        attributes: [
          { name: "title", type: String },
          { name: "author", type: "User" }
        ]
      }),
      article = new Article({ title: "The quick brown fox", author: null});

    assert.equal(article.author, null);
  });
  it("Should accept an undefined value passed into the constructor", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String }
        ]
      }),
      Article = jModel.create("Article",{
        attributes: [
          { name: "title", type: String },
          { name: "author", type: "User" }
        ]
      }),
      article = new Article({ title: "The quick brown fox" });

    assert.equal(article.author, undefined);
  });
  it("Should accept and convert a value assigned to a model attribute", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String }
        ]
      }),
      Article = jModel.create("Article",{
        attributes: [
          { name: "title", type: String },
          { name: "author", type: "User" }
        ]
      }),
      article = new Article({ title: "The quick brown fox" });

    article.author = { name: "John Doe" };

    assert.equal(article.author.getModelName(), "User");
    assert.equal(article.author.name, "John Doe");
  });
  it("Should accept a null value assigned to a model attribute", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String }
        ]
      }),
      Article = jModel.create("Article",{
        attributes: [
          { name: "title", type: String },
          { name: "author", type: "User" }
        ]
      }),
      article = new Article({ title: "The quick brown fox" });

    article.author = null;

    assert.equal(article.author, null);
  });
  it("Should accept an undefined value assigned to a model attribute", function(){
    var User = jModel.create("User", {
        attributes: [
          { name: "name", type: String }
        ]
      }),
      Article = jModel.create("Article",{
        attributes: [
          { name: "title", type: String },
          { name: "author", type: "User" }
        ]
      }),
      article = new Article({ title: "The quick brown fox" });

    article.author = undefined;

    assert.equal(article.author, null);
  });
});