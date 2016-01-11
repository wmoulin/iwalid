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

var validParameter = function(parameter) {
    if (!parameter) {
        throw new Error(parameter + " : dateValidator parameter must not be null !!!");
    } else if (!(parameter instanceof Date)) {
        throw new Error(parameter + " : dateValidator parameter must be a date !!!");
    }
};
