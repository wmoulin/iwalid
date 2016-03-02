"use strict";

import ValidatorHelper from "../helpers/validatorHelper";
import ValidatorError from "../exception/validatorError";
import ValidatorConfigError from "../exception/validatorConfigError";


/**
* Decorateur de valeur correspond à un email sur les classes, les getters ou les propriétés de classe et les paramètres de fonction
* @param {Object?} description - description de la proprété de la classe sur laquelle appliquer le décorateur.
*/
export default function match(description) {
  return function (target, key, descriptor) {
    ValidatorHelper.applyValidatorFctSwitchType(target, key, descriptor, description, testPattern);
  };
};

/**
* Methode appelée par le comparateur de validation
* {Object} value - valeur de l'attribut à valider
* {Object} description - description de la validation
*/
function testPattern(value, description) {
  let pattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
  let msgError = description.message || "the value not match to the email pattern.";
  if (typeof value != "undefined") {
    if (typeof value != "string") {
      throw new ValidatorConfigError( "Email validator error (value is not a string).", description);
    } else if (!pattern.test(value)) {
      throw new ValidatorError(msgError, description);
    }
  }
}
