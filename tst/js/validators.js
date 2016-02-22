'use strict';

import User from "./user";
import UserBis from "./userBis";
import UserTer from "./userTer";
import UserError from "./userError";
import ValidatorConfigError from "../../src/js/exception/validatorConfigError";
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
      assert.doesNotThrow(() => user.validate() , Error);
    });

    it("user should be invalid", function () {
      var user = new User(undefined, "password");
      assert.throws(() => user.validate(), Error);
    });
  });

  describe("UserBis", function () {
    it("userBis should be valid", function () {
      var user = new UserBis("name", "password");
      assert.doesNotThrow(() => user.validate(), Error);
    });

    it("userBis should be invalid", function () {
      var user = new UserBis(undefined, "password");
      assert.throws(() => user.validate(), Error);
    });
  });

  describe("UserTer", function () {
    it("userTer should be valid", function () {
      var user = new UserTer("name", "password");
      assert.doesNotThrow(() => user.validate(), Error);
    });

    it("userTer should be invalid (required)", function () {
      var user = new UserTer(undefined, "password");
      assert.throws(() => user.validate(), Error);
    });

    it("userTer should be invalid (notEmpty)", function () {
      var user = new UserTer("name", "");
      assert.throws(() => user.validate(), Error);
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

  describe("UserError", function () {
    it("userError should be valid", function () {
      var user = new UserError("name", "password");
      assert.throws(() => {user.validate();}, ValidatorConfigError);
    });
  });
});
