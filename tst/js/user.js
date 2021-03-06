"use strict";

import {validateCallFct} from "../../src/js/validators";
import dateValidators from "../../src/js/validators/dateValidators";
import * as requiredValidators from "../../src/js/validators/requiredValidators";

@validateCallFct()
@requiredValidators.required({propName: "name"})
@requiredValidators.required({propName: "password"})
export default class User {

  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
};
