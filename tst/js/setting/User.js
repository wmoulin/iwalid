"use strict";

import {validateCallFct} from "../../../src/js/validators";
import * as requiredValidators from "../../../src/js/validators/requiredValidators";

/**
* Classe pour tester le parametrage de l'ordre des validateurs
*/
@validateCallFct()
export default class User {
  @requiredValidators.required({index: 1, stopOnError: true})
  name = "";

  @requiredValidators.notEmpty({index: 0})
  password = "";

  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
};
