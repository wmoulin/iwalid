"use strict";

import validate from "../../src/js/validators";
import dateValidators from "../../src/js/validators/dateValidators";
import * as requiredValidators from "../../src/js/validators/requiredValidators";

@validate
@requiredValidators.required("name")
@requiredValidators.required("password")
class User {
  
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
}

module.exports = User;