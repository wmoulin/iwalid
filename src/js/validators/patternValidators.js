"use strict";

import ValidatorHelper from "../helpers/ValidatorHelper"


/**
* Decorateur de valeur correspond à un pattern sur les classes, les getters ou les propriétés de classe et les paramètres de fonction
* @param {string} propName nom de la proprété de la classe sur laquelle appliquer le décorateur.
*/
export default function match(pattern, param) {
  return function (target, key, descriptor) {
    if (!key && !descriptor) { // decorateur de classe
      ValidatorHelper.initField(target, param);
      ValidatorHelper.applyValidatorOnProperty(target, param, testPattern, pattern);    
    } else if (descriptor && (descriptor.get || descriptor.initializer)) { // decorateur de propriété
      ValidatorHelper.initField(target.constructor, key);
      ValidatorHelper.applyValidatorOnProperty(target.constructor, key, testPattern, pattern);
    } else if (descriptor && descriptor.value) { // decorateur de fonction
      ValidatorHelper.applyValidatorOnFunction(descriptor, param, testPattern, pattern);
    }
  };
};

function testPattern(value, msgs, pattern) {
  if (typeof value == "undefined") {
    throw new Error(msgs.join().replace(",", " ") + " : pattern validator error (value is undefined) !!!");
  } else {
    if (typeof value != "string") {
      throw new Error(msgs.join().replace(",", " ") + " : pattern validator error (value is not a string) !!!");
    } else if (!value.match(pattern)) {
      throw new Error(msgs.join().replace(",", " ") + " : pattern validator error (value not match)!!!");
    }
  }
}
