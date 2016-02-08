"use strict";

import validate from "../../../src/js/validators";
import patternValidator from "../../../src/js/validators/patternValidators";
import * as requiredValidators from "../../../src/js/validators/requiredValidators";

@validate
class User {
  
  @requiredValidators.required()
  name = "";

  @patternValidator(/^[0-9]+$/)
  @requiredValidators.notEmpty()
  password = "";
  
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
}

module.exports = User;