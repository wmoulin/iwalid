"use strict";
import path from "path";
import fs from "fs";
import ValidatorConfiguration from "../validatorConfiguration";
import ValidatorConfigError from "../exception/validatorConfigError";
import ValidationError from "../exception/validationError";
import ValidatorError from "../exception/validatorError";

export default class ValidatorHelper {

  constructor() {
  }

  /**
  * Ajout les attributs nécessaires au module de validation.
  * @param {Object} target - Classe cible du décorateur.
  * @param {ValidatorConfiguration} description - description du décorateur.
  */
  static initField(target, description) {

    if (!target.__validation__) {
      target.__validation__ = {};
    }

    if (!target.__validationOrder__) {
      target.__validationOrder__ = [];
    }

    if (!target.__validation__[description.propName]) {
      target.__validation__[description.propName] = [];
    }
  }

  /**
  * Charge un fichier JSON
  * @param {String} chemin du fichier
  * @return {Object} l'objet Json dans le fichier
  */
  static loadJsonFile(jsonFile) {
    if (fs.existsSync(jsonFile)) {
      return require(jsonFile);
    }
  }

  /**
  * Ajout un validateur sur une propriété de classe ou un function.
  * @param {Object|function} target - instance ou constructeur de l'objet à valider .
  * @param {?string} key - nom de l'attribut concerné par la validation.
  * @param {?Object} descriptor - descripteur de la propriété (attribut / fonction).
  * @param {?Object} decoArgs - paramètres passer au décorateur.
  * @param {!function} fctToCall - fonction à appeler pour la validation.
  * @param {?...extraParameters} extraParameters - complément de paramètres pour la fonction.
  * @throws {ValidatorConfigError} Type de decorateur impossible à déduire.
  */
  static applyValidatorFctSwitchType(target, key, descriptor, decoArgs, fctToCall, ...extraParameters) {

    let description = !decoArgs ? new ValidatorConfiguration({}) : decoArgs instanceof ValidatorConfiguration ? decoArgs : new ValidatorConfiguration(decoArgs);
    description.propName = key || description.propName;

    if (target && !key) { // decorateur de classe
      ValidatorHelper.initField(target, description);
      ValidatorHelper.applyValidatorOnProperty(target, description, fctToCall, extraParameters);
    } else if (target && key && !descriptor) { // config externe
      ValidatorHelper.initField(target.constructor, description);
      ValidatorHelper.applyValidatorOnProperty(target.constructor, description, fctToCall, extraParameters);
    } else if (target && key && descriptor && (descriptor.get || descriptor.initializer)) { // decorateur de propriété
      ValidatorHelper.initField(target.constructor, description);
      ValidatorHelper.applyValidatorOnProperty(target.constructor, description, fctToCall, extraParameters);
    } else if (descriptor && descriptor.value) { // decorateur de fonction
      if (typeof description.index == "undefined") {
        throw new ValidatorConfigError("Index undefined (Function Decorator).", description);
      }
      ValidatorHelper.applyValidatorOnFunction(descriptor, description, fctToCall, extraParameters);
    } else {
      throw new ValidatorConfigError("Unknow type of Decorator to apply.", description);
    }
  }

  /**
  * Ajout un validateur sur une propriété de classe.
  * @param {function} targetClass - constructeur de l'objet à valider.
  * @param {ValidatorConfiguration} description - description du décorateur.
  * @param {function} fctToCall - fonction à appeler pour la validation de l'attribut.
  * @param {...extraParameters} extraParameters - complément de paramètres pour la fonction.
  */
  static applyValidatorOnProperty(targetClass, description, fctToCall, extraParameters) {
    targetClass.__validation__[description.propName].push(function (value) {
      var argsForFctToCall = [value, description];
      if (extraParameters) {
        argsForFctToCall = argsForFctToCall.concat(extraParameters);
      }
      fctToCall.apply(this.caller, argsForFctToCall);
    });

    let groupIndex = description && description.groupIndex != undefined ? description.groupIndex : 0;

    if (!targetClass.__validationOrder__[groupIndex]) {
      targetClass.__validationOrder__[groupIndex] = [];
    }

    let indexIngroup = description && description.index != undefined ? description.index : targetClass.__validationOrder__[groupIndex].length;

    targetClass.__validationOrder__[groupIndex].splice(indexIngroup, 0, {key : description.propName, validatorIdx : targetClass.__validation__[description.propName].length - 1});
  }

  /**
  * Ajout un validateur sur les paramètres d'une fonction.
  * @param {Object} descriptor - descripteur de la fonction.
  * @param {?ValidatorConfiguration} description - paramètres passer au décorateur.
  * @param {function} fctToCall - fonction à appeler pour chaque paramètre.
  * @param {...extraParameters} extraParameters - complément de paramètres pour la fonction.
  */
  static applyValidatorOnFunction(descriptor, description, fctToCall, extraParameters) {

    if (!descriptor.value.__validation__ && !descriptor.value.__validation__) {
      let oldFunct = descriptor.value;
      descriptor.value = function() {
        let errs = [];
        for (let index in descriptor.value.__validation__) {
          let validatorDesc = descriptor.value.__validation__[index];
          try {

            var argsForFctToCall = [arguments[description.index], validatorDesc.description];
            if (extraParameters) {
              argsForFctToCall = argsForFctToCall.concat(extraParameters);
            }
            validatorDesc.validator.apply(this.caller, argsForFctToCall);
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

          if (errs && Array.isArray(errs) && errs.length > 0) {
            throw new ValidationError(errs);
          }
          return descriptor.value.__oldFunct__.apply(this.caller, arguments);
        };
        descriptor.value.__oldFunct__ = oldFunct;
        descriptor.value.__validation__ = [];
      }
      descriptor.value.__validation__.push({description: description, validator : fctToCall});
    }

};
