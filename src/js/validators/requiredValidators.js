"use strict";

import ValidatorHelper from "../helpers/ValidatorHelper"

export function required(propName) {

  return function (target, key, descriptor) {
  
    ValidatorHelper.initField(target, propName);
  
    target.valid[propName].push(function (value) {
     if (!value) {
          throw new Error(key + " : required validator error !!!");
      }
    });
  };
};

export function requiredField(target, key, descriptor) {
  ValidatorHelper.initField(target.constructor, key);
  target.constructor.valid[key].push(function (value) {
      if (!value) {
          throw new Error(key + " : required validator error !!!");
      }
  });
};


export function requiredParameter(paramIdxs) {
  return function (target, key, descriptor) {
    let oldFunct = descriptor.value;
    descriptor.value = function() {
      paramIdxs.forEach((paramIdx) => {
        if (!arguments[paramIdx]) {
          throw new Error(key + " : required validator error !!!");
        }
      });
      oldFunct.apply(this.caller, arguments);
    };
    
  };
};

export function notEmpty(target, key, descriptor) {
    if (!target.valid) {
        target.valid = {};
    }

    if (!target.valid[key]) {
        target.valid[key] = [];
    }

    target.valid[key].push(function (value) {
        if (!value) {
            throw new Error(key + " : required validator error !!!");
        } else {
            if (!(value instanceof String)) {
                throw new Error(key + " : required.notEmpty validator only for string !!!");
            } else if (value === "") {
                throw new Error(key + " : required validator error !!!");
            }
        }
    });
};
