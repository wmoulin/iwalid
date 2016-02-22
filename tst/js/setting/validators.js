'use strict';

import User from "./user";
import ValidationError from "../../../src/js/exception/validationError";
var assert = require("assert");
var should = require("should");

describe("setting", function () {
  describe("Order", function () {

    it("user should have 2 errors", function () {
      var user = new User(undefined, undefined);
      try {
        user.validate();
      } catch(e) {
        e.should.be.instanceof(ValidationError);
        e.errors.should.be.instanceof(Array).and.have.lengthOf(2);
      }
    });

  });


});
