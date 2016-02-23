"use strict";

import {validateCallFct} from "../../../src/js/validators";
import * as requiredValidators from "../../../src/js/validators/requiredValidators";

/**
* Classe pour tester le parametrage de l'ordre des validateurs
*/
@validateCallFct()
export default class User {
  @requiredValidators.required({stopOnError: true})
  name = "";

  @requiredValidators.notEmpty({groupIndex: 1})
  password = "";

  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
};
