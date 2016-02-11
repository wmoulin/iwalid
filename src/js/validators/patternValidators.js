"use strict";

import ValidatorHelper from "../helpers/validatorHelper";
import ValidatorError from "../exception/validatorError";
import ValidatorConfigError from "../exception/validatorConfigError";


/**
* Decorateur de valeur correspond à un pattern sur les classes, les getters ou les propriétés de classe et les paramètres de fonction
* @param {string} pattern - pattern à appliquer pour la validation.
* @param {Object?} description - description de la proprété de la classe sur laquelle appliquer le décorateur.
*/
export default function match(pattern, description) {
  return function (target, key, descriptor) {
    ValidatorHelper.applyValidatorFctSwitchType(target, key, descriptor, description, testPattern, pattern);
  };
};

/**
* Methode appelée par le comparateur de validation par pattern
* {Object} value - valeur de l'attribut à valider
* {Object} description - description de la validation
* {pattern} pattern - pattern à tester
*/
function testPattern(value, description, pattern) {
  let msgError = description.message || "the value not match to the pattern.";
  if (typeof value != "undefined") {
    if (typeof value != "string") {
      throw new ValidatorConfigError( "Pattern validator error (value is not a string).", description);
    } else if (!pattern || typeof pattern != "object" || !pattern.test) {
      throw new ValidatorConfigError( "Pattern validator error (pattern is not a string pattern).", description);
    } else if (!pattern.test(value)) {
      throw new ValidatorError(msgError, description);
    }
  }
}
