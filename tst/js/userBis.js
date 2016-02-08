"use strict";

import validate from "../../src/js/validators";
import * as requiredValidators from "../../src/js/validators/requiredValidators";

@validate
class UserBis {
  
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
  
  @requiredValidators.required()
  get name() { return this._name};
  set name(value) { this._name = value};

  @requiredValidators.required()
  get password() { return this._password};
  set password(value) { this._password = value};

}

module.exports = UserBis;