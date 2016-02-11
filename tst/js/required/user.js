"use strict";

import {validateCallFct} from "../../../src/js/validators";
import * as requiredValidators from "../../../src/js/validators/requiredValidators";
import Contact from "./contact";

@validateCallFct()
class User {

  @requiredValidators.required()
  name = "";

  @requiredValidators.required()
  password = "";

  contact = new Contact("");

  constructor(name, password) {
    this.name = name;
    this.password = password;
  }

}

module.exports = User;
