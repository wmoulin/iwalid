"use strict";

import {Promise} from "bluebird";
import ValidationError from "./exception/validationError";
import ValidatorLoader from "./validators-loader";

/*
 type ClassDecorator = <TFunction extends Function>(target: TFunction): TFunction | void;
 type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
 type PropertyDecorator = (target: Object, propertyKey: string | symbol): void;
 type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
 */

/**
* Decorateur pour ajouter le méthode de point d'entrée du module de validation
* param {Object} configuration - configuration globale de validation
*/
export default function validate() {
  return function(target) {

    if (!target.prototype.__validate__) {
      target.prototype.__validate__ = function(configuration, errors) {
        let config = configuration || ValidatorLoader.globalConf;
        let errors = errors || [];
        try {
          let childsValidate = [];
          if (target.__validation__) {
            for (var attrib in target.__validation__) {
              if (this[attrib] && this[attrib].__validate__ && typeof this[attrib].__validate__ === "function") {
                childsValidate.push(attrib);
              }
              try {
                target.__validation__[attrib].forEach((validator) => {
                  validator.bind(this)(this[attrib]);
                });
              } catch (e) {
                if (e instanceof ValidatorError && e.descriptor) {
                  errors.push[e];
                  if (e.descriptor.stopOnError) {
                    throw new ValidationError(this.errors);
                  } else if (e.descriptor.nextOnError) {
                    continue;
                  }
                }
                throw e;
              }
            }
            for (var attrib in childsValidate) {
              this[childsValidate[attrib]].__validate__.bind(this[childsValidate[attrib]])(configuration, errors);
            }

            if (errors && Array.isArray(errors) && errors.length > 0) {
              throw new ValidationError(errors);
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
export function validatePromise(rejectFct) {
  return function(target) {
    if (!target.prototype.__validatePromise__) {
      target.prototype.__validatePromise__ = function (configuration) {
        let p = Promise.resolve(true).bind({errors: []});
        let childsValidate = [];
        if (target.__validation__) {
          for (var attrib in target.__validation__) {
            if (this[attrib] && this[attrib].__validate__ && typeof this[attrib].__validate__ === "function") {
              childsValidate.push(attrib);
            }
            target.__validation__[attrib].forEach((validator) => {
              p = p.then(() => {validator.bind(this)(this[attrib]);})
              .catch(ValidatorError, (e)=>{
                this.errors.push[e];
                if (e.descriptor) {
                  if (e.descriptor.stopOnError) {
                    throw new ValidationError(this.errors);
                  } else if (!e.descriptor.nextOnError) {
                    throw e;
                  }
                }
              });
            });
            p = p.catch(ValidatorError, (e)=>{
              this.errors.push[e];
            });
          }
          for (var attrib in childsValidate) {
            p = p.then(() => {return this[childsValidate[attrib]].__validatePromise__.bind(this[childsValidate[attrib]])();})
          }
        }
        p = p.finally(()=>{
          target.__validatePromise__ = target.__prevValidation__;
          if (this.errors && Array.isArray(this.errors) && this.errors.length > 0) {
            throw new ValidationError(this.errors);
          }
        });
        if (rejectFct) {
          p = p.catch(ValidationError);
        }

        return p;
      }
    }
  };
};
