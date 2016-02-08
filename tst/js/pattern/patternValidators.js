'use strict';

var User = require("./user");
var assert = require("assert");

describe('Pattern Validation', function () {
  describe('User', function () {
    it('user should be valid', function () {
      var user = new User("name", "6546");
      assert.doesNotThrow(() => user.__validate__(), Error);
    });

    it('user should be invalid', function () {
      var user = new User("name", "a");
      assert.throws(() => user.__validate__(), Error);
    });
  });
});