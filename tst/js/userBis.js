"use strict";

import {validateCallFct} from "../../src/js/validators";
import * as requiredValidators from "../../src/js/validators/requiredValidators";

@validateCallFct()
export default class UserBis {

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

};
