"use strict";

import ValidatorHelper from "../helpers/ValidatorHelper";
import ValidatorError from "../exception/validatorError";
import ValidatorConfigError from "../exception/validatorConfigError";

////
// Décorateurs génériques
//////////////////////////////////////////////
/**
* Decorateur de valeur obligatoire sur les classes, les getters ou les propriétés de classe et les paramètres de fonction
* @param {Object} description - description de la proprété de la classe sur laquelle appliquer le décorateur.
*/
export function required(description) {
  return function (target, key, descriptor) {
    ValidatorHelper.applyValidatorFctSwitchType(target, key, descriptor, description, testUndefined);
  };
};


/**
* Decorateur de valeur non vide sur les classes, les getters ou les propriétés de classe et les paramètres de fonction
* @param {Object} description - description de la proprété de la classe sur laquelle appliquer le décorateur.
*/
export function notEmpty(description) {
  return function (target, key, descriptor) {
    ValidatorHelper.applyValidatorFctSwitchType(target, key, descriptor, description, testNotEmpty);
  };
};

function testUndefined(value, description) {
  let msgError = description.message || "the value is undefined.";
  if (typeof value == "undefined") {
    throw new ValidatorError(msgError, description);
  }
}

function testNotEmpty(value, description) {
  let msgError = description.message || "the value is empty or undefined.";
  if (typeof value == "undefined") {
    throw new ValidatorError(msgError, description);
  } else {
    if (typeof value != "string") {
      throw new ValidatorConfigError( "Empty validator error (value is not a string).", description);
    } else if (value === "") {
      throw new ValidatorError(msgError, description);
    }
  }
}
