'use strict';

var User = require("./user");
var assert = require('assert');

describe('User', function () {
  var user = new User("name", "password");
  it('user should be initialized', function () {
    assert.equal("name", user.name);
    assert.equal("password", user.password);
  });
  it('user should be valid', function () {
    assert.doesNotThrow(user.validate, Error);
  });
});