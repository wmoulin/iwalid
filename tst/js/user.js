"use strict";

import validate from "../../src/js/validators";
import dateValidators from "../../src/js/validators/dateValidators";
import * as requiredValidators from "../../src/js/validators/requiredValidators";

@validate()
@requiredValidators.required({propName: "name"})
@requiredValidators.required({propName: "password"})
class User {

  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
}

module.exports = User;
