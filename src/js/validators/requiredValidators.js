"use strict";

import ValidatorHelper from "../helpers/ValidatorHelper"

////
// Décorateurs spécifiques
//////////////////////////////////////////////
/**
* Decorateur d'attribut obligatoire sur la classe
* @param {string} propName nom de la proprété de la classe sur laquelle appliquer le décorateur.
*/
export function requiredProp(propName) {
  return function (target) {
    ValidatorHelper.initField(target, propName);
    ValidatorHelper.applyValidatorOnProperty(target, propName, testUndefined);
  };
};

/**
* Decorateur d'attribut obligatoire sur un getter ou une propriété de classe
*/
export function requiredField(target, key, descriptor) {
  ValidatorHelper.initField(target.constructor, key);
  ValidatorHelper.applyValidatorOnProperty(target.constructor, key, testUndefined);
};


/**
* Decorateur de paramètre obligatoire sur une fonction
* @param {Array<integer>} paramIdxs tableau des indexes des paramètres sur lequel appliquer le décorateur.
*/
export function requiredParameter(paramIdxs) {
  return function (target, key, descriptor) {
    ValidatorHelper.applyValidatorOnFunction(descriptor, paramIdxs, testUndefined);
  };
};

////
// Décorateurs génériques
//////////////////////////////////////////////
/**
* Decorateur de valeur obligatoire sur les classes, les getters ou les propriétés de classe et les paramètres de fonction
* @param {string} propName nom de la proprété de la classe sur laquelle appliquer le décorateur.
*/
export function required(param) {
  return function (target, key, descriptor) {
    if (!key && !descriptor) { // decorateur de classe
      ValidatorHelper.initField(target, param);
      ValidatorHelper.applyValidatorOnProperty(target, param, testUndefined);    
    } else if (descriptor && (descriptor.get || descriptor.initializer)) { // decorateur de propriété
      ValidatorHelper.initField(target.constructor, key);
      ValidatorHelper.applyValidatorOnProperty(target.constructor, key, testUndefined);
    } else if (descriptor && descriptor.value) { // decorateur de fonction
      ValidatorHelper.applyValidatorOnFunction(descriptor, param, testUndefined);
    }

  };
};


/**
* Decorateur de valeur non vide sur les classes, les getters ou les propriétés de classe et les paramètres de fonction
* @param {string} propName nom de la proprété de la classe sur laquelle appliquer le décorateur.
*/
export function notEmpty(param) {
  return function (target, key, descriptor) {
    if (!key && !descriptor) { // decorateur de classe
      ValidatorHelper.initField(target, param);
      ValidatorHelper.applyValidatorOnProperty(target, param, testNotEmpty);    
    } else if (descriptor && (descriptor.get || descriptor.initializer)) { // decorateur de propriété
      ValidatorHelper.initField(target.constructor, key);
      ValidatorHelper.applyValidatorOnProperty(target.constructor, key, testNotEmpty);
    } else if (descriptor && descriptor.value) { // decorateur de fonction
      ValidatorHelper.applyValidatorOnFunction(descriptor, param, testNotEmpty);
    }

  };
};

function testUndefined(value, msgs) {
  if (typeof value == "undefined") {
    throw new Error(msgs.join().replace(",", " ") + " : required validator error !!!");
  }
}

function testNotEmpty(value, msgs) {
  if (typeof value == "undefined") {
    throw new Error(msgs.join().replace(",", " ") + " : empty validator error (value is undefined) !!!");
  } else {
    if (typeof value != "string") {
      throw new Error(msgs.join().replace(",", " ") + " : empty validator error (value is not a string) !!!");
    } else if (value === "") {
      throw new Error(msgs.join().replace(",", " ") + " : empty validator error (value is empty)!!!");
    }
  }
}
