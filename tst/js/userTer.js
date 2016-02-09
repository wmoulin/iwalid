"use strict";

import validate from "../../src/js/validators";
import patternValidators from "../../src/js/validators/patternValidators";
import * as requiredValidators from "../../src/js/validators/requiredValidators";

@validate()
class UserTer {

  @requiredValidators.required({message: "le nom est obligatoire", stopOnError: false, nextOnError: true})
  name = "";

  @requiredValidators.notEmpty()
  password = "";

  constructor(name, password) {
    this.name = name;
    this.password = password;
  }

  @requiredValidators.required({index: 0, propName: "param", message: ""})
  test(param) {
    return param;
  }
}

module.exports = UserTer;
