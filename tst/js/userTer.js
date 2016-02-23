"use strict";

import {validateCallFct} from "../../src/js/validators";
import patternValidators from "../../src/js/validators/patternValidators";
import * as requiredValidators from "../../src/js/validators/requiredValidators";

@validateCallFct()
export default class UserTer {

  @requiredValidators.required({message: "le nom est obligatoire", stopOnError: false, nextOnError: true})
  name = "";

  @requiredValidators.notEmpty()
  password = "";

  constructor(name, password) {
    this.name = name;
    this.password = password;
  }

  @requiredValidators.notEmpty({index: 0, propName: "param", message: ""})
  @requiredValidators.required({index: 0, propName: "param", message: ""})
  test(param) {
    return param;
  }

};
