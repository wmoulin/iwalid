"use strict";

import validators from "../../src/js/validators";
var _dateValidators = require("../../src/js/validators/dateValidators");
var _requiredValidators = require("../../src/js/validators/requiredValidators");

@validators.validate
class User {
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
}

module.exports = User;