"use strict";

import {Promise} from "bluebird";
import ValidationError from "./exception/validationError";
import ValidatorError from "./exception/validatorError";
import ValidatorLoader from "./validatorsLoader";

/*
 type ClassDecorator = <TFunction extends Function>(target: TFunction): TFunction | void;
 type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
 type PropertyDecorator = (target: Object, propertyKey: string | symbol): void;
 type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
 */

/**
* Decorateur pour ajouter le méthode de point d'entrée du module de validation.
* Cette méthode pourra renvoyer une suite de Promise ou fera appel au différents validateurs directement.
* @param {boolean} [promiseMode=true] - Active / Désactive le mode promise.
*/
export default function validate(promiseMode=true) {
  if (promiseMode) {
    return validatePromise();
  }
  return validateFct();

};


/**
* Decorateur pour ajouter le méthode de point d'entrée du module de validation.
* Cette méthode fera appel au différents validateurs directement.
* @param {boolean} [promiseMode=true] - Active / Désactive le mode promise.
*/
export function validateCallFct() {
  return validateFct();
};

/**
* Decorateur pour ajouter le méthode de point d'entrée du module de validation.
* Cette renverra une suite de Promise.
* @param {boolean} [promiseMode=true] - Active / Désactive le mode promise.
*/
export function validateWithPromise() {
  return validatePromise();
};

function validateFct() {
  return function(target) {

    if (!target.prototype.validate) {
      target.prototype.validate = function(configuration, errors) {
        let config = configuration || ValidatorLoader.globalConf || {};
        let errs = errors || [];
        try {
          let childsValidate = [];
          if (target.__validation__ && target.__validationOrder__) {
            for (let attrib in this) {
              if (this[attrib] && this[attrib].validate && typeof this[attrib].validate === "function") {
                // un objet à valider a été touvé dans les attributs
                childsValidate.push(attrib);
              }
            }
            // on valide les groupes en premier
            for(let idxGrp = 1; idxGrp < target.__validationOrder__.length; idxGrp++) {
              for(let idx = 0; idx < target.__validationOrder__[idxGrp].length; idx++) {
                let validatorDesc = target.__validationOrder__[idxGrp][idx]
                try {
                  target.__validation__[validatorDesc.key][validatorDesc.validatorIdx].bind(this)(this[validatorDesc.key]);
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
            }
            // on valide les non groupes ensuite
            for(let idx = 0; idx < target.__validationOrder__[0].length; idx++) {
              let validatorDesc = target.__validationOrder__[0][idx]
              try {
                target.__validation__[validatorDesc.key][validatorDesc.validatorIdx].bind(this)(this[validatorDesc.key]);
              } catch (e) {
                if (e instanceof ValidatorError && e.descriptor) {
                  errs.push(e);
                  if (e.descriptor.stopOnError) {
                    throw new ValidationError(errs);
                  } else if (e.descriptor.nextOnError) {
                    continue;
                  }
                } else {
                  throw e;
                }
              }
            }
            for (var attrib in childsValidate) {
              this[childsValidate[attrib]].validate.bind(this[childsValidate[attrib]])(config, errs);
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

function validatePromise() {
  return function(target) {
    if (!target.prototype.validate) {
      target.prototype.validate = function (rejectFct, configuration) {
        this.__errors__ = [];
        let config = configuration || ValidatorLoader.globalConf || {};
        let p = Promise.resolve(true);
        let childsValidate = [];
        if (target.__validation__) {
          for (var attrib in target.__validation__) {
            if (this[attrib] && this[attrib].validate && typeof this[attrib].validate === "function") {
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
            p = p.then(() => {return this[childsValidate[attrib]].validate.bind(this[childsValidate[attrib]])();})
          }
        }
        p = p.finally(()=>{
          target.__validation__ = target.__prevValidation__;
          if (this.__errors__ && Array.isArray(this.__errors__) && this.__errors__.length > 0) {
            let ex = new ValidationError(this.__errors__);
            delete this.__errors__;
            throw ex;
          }
        });
        if (rejectFct) {
          p = p.catch(rejectFct);
        } else {
           p = p.catch((e) => {
              console.err(e);
            }
          );
        }

        return p;
      }
    }
  };
};
