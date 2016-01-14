"use strict";

export function after(date) {
    var orEquals = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    validParameter(date);
    return function (target, key, descriptor) {
        FieldValidator.initField(target, key);
        target.valid[key].push(function (value) {
            if (!value) {
                throw new Error(key + " : required validator error !!!");
            } else {
                if (!(value instanceof Date)) {
                    throw new Error(key + " : dateValidator.after validator only for date !!!");
                } else if (!orEquals && date.getTime() > value.getTime() || date.getTime() >= value.getTime()) {
                    throw new Error(key + " : required validator error !!!");
                }
            }
        });
    };
};

export function before(date) {
    var orEquals = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    validParameter(date);
    return function (target, key, descriptor) {
        FieldValidator.initField(target, key);
        target.valid[key].push(function (value) {
            if (!value) {
                throw new Error(key + " : required validator error !!!");
            } else {
                if (!(value instanceof Date)) {
                    throw new Error(key + " : dateValidator.after validator only for date !!!");
                } else if (!orEquals && date.getTime() < value.getTime() || date.getTime() <= value.getTime()) {
                    throw new Error(key + " : required validator error !!!");
                }
            }
        });
    };
};

export function before(date, param) {
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

function validParameter(parameter) {
    if (!parameter) {
        throw new Error(parameter + " : dateValidator parameter must not be null !!!");
    } else if (!(parameter instanceof Date)) {
        throw new Error(parameter + " : dateValidator parameter must be a date !!!");
    }
}

function validParameter(parameter) {
    if (!parameter) {
        throw new Error(parameter + " : dateValidator parameter must not be null !!!");
    } else if (!(parameter instanceof Date)) {
        throw new Error(parameter + " : dateValidator parameter must be a date !!!");
    }
}