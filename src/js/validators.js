"use strict";

import {Promise} from "bluebird";
import ValidationError from "./exception/validationError";
import ValidatorError from "./exception/validatorError";
import ValidatorLoader from "./validators-loader";

/*
 type ClassDecorator = <TFunction extends Function>(target: TFunction): TFunction | void;
 type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
 type PropertyDecorator = (target: Object, propertyKey: string | symbol): void;
 type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
 */

/**
* Decorateur pour ajouter le méthode de point d'entrée du module de validation
*/
export default function validate() {
  return function(target) {

    if (!target.prototype.__validate__) {
      target.prototype.__validate__ = function(configuration, errors) {
        let config = configuration || ValidatorLoader.globalConf || {};
        let errs = errors || [];
        try {
          let childsValidate = [];
          if (target.__validation__) {
            for (var attrib in target.__validation__) {
              if (!Object.getOwnPropertyDescriptor(this, attrib)) {
                console.log("entries", Object.entries(this));
                console.log("descriptor", Object.getOwnPropertyDescriptor(this, attrib));
                console.log("value", attrib, this[attrib]);
                continue;
              }
              if (this[attrib] && this[attrib].__validate__ && typeof this[attrib].__validate__ === "function") {
                childsValidate.push(attrib);
              }
              try {
                target.__validation__[attrib].forEach((validator) => {
                  validator.bind(this)(this[attrib]);
                });
              } catch (e) {
                if (e instanceof ValidatorError && e.descriptor) {
                  errs.push(e);
                  if (e.descriptor.stopOnError) {
                    throw new ValidationError(errs);
                  } else if (e.descriptor.nextOnError) {
                    continue;
                  }
                }
                throw e;
              }
            }
            for (var attrib in childsValidate) {
              this[childsValidate[attrib]].__validate__.bind(this[childsValidate[attrib]])(config, errs);
            }
            if (errs && Array.isArray(errs) && errs.length > 0) {
              throw new ValidationError(errs);
            }
          }
        } finally {
          if (target.__prevValidation__) {
            target.__validation__ = target.__prevValidation__;
          }
        }
      };
    }
  };
};


/**
* Permet de promisifier la validation
*/
export function validatePromise() {
  return function(target) {
    if (!target.prototype.__validatePromise__) {
      target.prototype.__validatePromise__ = function (rejectFct, configuration) {
        this.__errors__ = [];
        let config = configuration || ValidatorLoader.globalConf || {};
        let p = Promise.resolve(true);
        let childsValidate = [];
        if (target.__validation__) {
          for (var attrib in target.__validation__) {
            if (!Object.getOwnPropertyDescriptor(this, attrib)) {
              continue;
            }
            if (this[attrib] && this[attrib].__validate__ && typeof this[attrib].__validate__ === "function") {
              childsValidate.push(attrib);
            }
            target.__validation__[attrib].forEach((validator) => {
              p = p.then(() => {validator.bind(this)(this[attrib]);})
              .catch(ValidatorError, (e) => {
                this.__errors__.push(e);
                if (e.descriptor) {
                  if (e.descriptor.stopOnError) {
                    throw new ValidationError(this.__errors__);
                  } else if (!e.descriptor.nextOnError) {
                    throw e;
                  }
                  // else continue next validator to this attribute
                }
              });
            });
            p = p.catch(ValidatorError, (e) => {
              // continue next attribute to validate
            });
          }
          for (var attrib in childsValidate) {
            p = p.then(() => {return this[childsValidate[attrib]].__validatePromise__.bind(this[childsValidate[attrib]])();})
          }
        }
        p = p.finally(()=>{
          target.__validatePromise__ = target.__prevValidation__;
          if (this.__errors__ && Array.isArray(this.__errors__) && this.__errors__.length > 0) {
            let ex = new ValidationError(this.__errors__);
            delete this.__errors__;
            throw ex;
          }
        });
        if (rejectFct) {
          p = p.catch(rejectFct);
        }

        return p;
      }
    }
  };
};
