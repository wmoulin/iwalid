"use strict";

import ValidatorHelper from "../helpers/ValidatorHelper"
import ValidatorError from "../exception/validatorError";
import ValidatorConfigError from "../exception/validatorConfigError";


/**
* Decorateur de valeur correspond à un pattern sur les classes, les getters ou les propriétés de classe et les paramètres de fonction
* @param {string} propName nom de la proprété de la classe sur laquelle appliquer le décorateur.
*/
export default function match(pattern, param) {
  return function (target, key, descriptor) {
    ValidatorHelper.applyValidatorFctSwitchType(target, key, descriptor, [param], testPattern, pattern);
  };
};

function testPattern(value, descriptor, pattern) {
  let msgError = "the value not match.";
  if (typeof value != "undefined") {
    if (typeof value != "string") {
      throw new ValidatorConfigError( "Pattern validator error (value is not a string).", descriptor);
    } else if (!pattern.test(value)) {
      throw new ValidatorError(msgError, descriptor);
    }
  }
}
