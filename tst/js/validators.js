'use strict';

var User = require("./user");
var UserBis = require("./userBis");
var UserTer = require("./userTer");
var assert = require("assert");

describe("Validation", function () {
  describe("User", function () {
    it("user should be initialized", function () {
      var user = new User("name", "password");
      assert.equal("name", user.name);
      assert.equal("password", user.password);
    });

    it("user should be valid", function () {
      var user = new User("name", "password");
      assert.doesNotThrow(() => user.__validate__(), Error);
    });

    it("user should be invalid", function () {
      var user = new User(undefined, "password");
      assert.throws(() => user.__validate__(), Error);
    });
  });

  describe("UserBis", function () {
    it("userBis should be valid", function () {
      var user = new UserBis("name", "password");
      assert.doesNotThrow(() => user.__validate__(), Error);
    });

    it("userBis should be invalid", function () {
      var user = new UserBis(undefined, "password");
      assert.throws(() => user.__validate__(), Error);
    });
  });

  describe("UserTer", function () {
    it("userTer should be valid", function () {
      var user = new UserTer("name", "password");
      try {
      user.__validate__();
      } catch(e) {
      console.log(e.message);
      }
      
      assert.doesNotThrow(() => user.__validate__(), Error);
    });

    it("userTer should be invalid (required)", function () {
      var user = new UserTer(undefined, "password");
      assert.throws(() => user.__validate__(), Error);
    });

    it("userTer should be invalid (notEmpty)", function () {
      var user = new UserTer("name", "");
      assert.throws(() => user.__validate__(), Error);
    });
    
    it("userTer parameter should be valid", function () {
      var user = new UserTer("name", "password");
      assert.doesNotThrow(() => user.test("param1"), Error);
      assert.equal(user.test("param1"), "param1");
    });
    
    it("userTer parameter should be invalid", function () {
      var user = new UserTer("name", "password");
      assert.throws(() => user.test(), Error);
    });

  });
});