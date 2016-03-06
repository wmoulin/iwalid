"use strict";
import ValidatorHelper from "../helpers/validatorHelper";


export function equal(date, description) {
  validParameter(date);
  return function (target, key, descriptor) {
    ValidatorHelper.applyValidatorFctSwitchType(target, key, descriptor, description, compareDate, date, 1);
  };
};

export function after(date, description) {
  validParameter(date);
  return function (target, key, descriptor) {
    ValidatorHelper.applyValidatorFctSwitchType(target, key, descriptor, description, compareDate, date, 2);
  };
};

export function afterOrEqual(date, description) {
  validParameter(date);
  return function (target, key, descriptor) {
    ValidatorHelper.applyValidatorFctSwitchType(target, key, descriptor, description, compareDate, date, 3);
  };
};

export function before(date, description) {
  validParameter(date);
  return function (target, key, descriptor) {
    ValidatorHelper.applyValidatorFctSwitchType(target, key, descriptor, description, compareDate, date, -2);
  };
};

export function beforeOrEqual(date, description) {
  validParameter(date);
  return function (target, key, descriptor) {
    ValidatorHelper.applyValidatorFctSwitchType(target, key, descriptor, description, compareDate, date, -1);
  };
};

function validParameter(parameter) {
    if (!parameter) {
        throw new ValidatorConfigError(parameter + " : dateValidator parameter must not be null !!!");
    } else if (!(parameter instanceof Date)) {
        throw new ValidatorConfigError(parameter + " : dateValidator parameter must be a date !!!");
    }
}

/**
* Methode appelée par le comparateur de validation de date
* {Object} value - valeur de l'attribut à valider
* {Object} description - description de la validation
* {Date} date - valeur de comparaison
* {int} operator - valeur representation l'operator à appliquer
*       -2 <, -1 <=, 1 =, 2 >, 3 >=
*/
function compareDate(value, description, date, operator=0) {
  let messages = {
    "-2": "Date validator error (value must be lower or equal).",
    "-1": "Date validator error (value must be lower).",
    "1": "Date validator error (value must equal).",
    "2": "Date validator error (value must be greater).",
    "3": "Date validator error (value must be greater or equal)."
  };
  let msgError = description.message || messages[operator];

  if (typeof value == "undefined") {
    throw new ValidatorError(msgError, description);
  } else {
    if (typeof value != "date") {
      throw new ValidatorConfigError( "Date validator error (value is not a date).", description);
    } else if (!operator || operator || isNaN(operator) || operator < 3 || operator > 2 || operator == 0) {
      throw new ValidatorConfigError( "Date validator error (bad operator value).", description);
    } else {
      if (operator < 0) {
        if (operator == -2 && date.getTime() > value.getTime()) {
          throw new ValidatorError(msgError, description);
        } else if (operator == -1 && date.getTime() >= value.getTime()) {
          throw new ValidatorError(msgError, description);
        }
      } else if (operator > 1) {
        if (operator == 3 && date.getTime() < value.getTime()) {
          throw new ValidatorError(msgError, description);
        } else if (operator == 2 && date.getTime() <= value.getTime()) {
          throw new ValidatorError(msgError, description);
        }
      } else if (date.getTime() == value.getTime()) {
        throw new ValidatorError(msgError, description);
      }
    }
  }
}
