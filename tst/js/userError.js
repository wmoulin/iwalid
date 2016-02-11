"use strict";

import {validateCallFct} from "../../src/js/validators";
import patternValidator from "../../src/js/validators/patternValidators";
import * as requiredValidators from "../../src/js/validators/requiredValidators";

@validateCallFct()
export default class User {
  @requiredValidators.required()
  name = "";

  @patternValidator(1)
  @requiredValidators.notEmpty()
  password = "";
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
};
