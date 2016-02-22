"use strict";
import path from "path";
import fs from "fs";
import ValidatorConfiguration from "../validatorConfiguration";
import ValidatorConfigError from "../exception/validatorConfigError";


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
    targetClass.__validationOrder__.splice(description && description.index != undefined ? description.index : targetClass.__validationOrder__.length, 0, {key : description.propName, validatorIdx : targetClass.__validation__[description.propName].length - 1});
  }

  /**
  * Ajout un validateur sur les paramètres d'une fonction.
  * @param {Object} descriptor - descripteur de la fonction.
  * @param {?ValidatorConfiguration} description - paramètres passer au décorateur.
  * @param {function} fctToCall - fonction à appeler pour chaque paramètre.
  * @param {...extraParameters} extraParameters - complément de paramètres pour la fonction.
  */
  static applyValidatorOnFunction(descriptor, description, fctToCall, extraParameters) {
    let oldFunct = descriptor.value;
    descriptor.value = function() {
      var argsForFctToCall = [arguments[description.index], description];
      if (extraParameters) {
        argsForFctToCall = argsForFctToCall.concat(extraParameters);
      }
      fctToCall.apply(this.caller, argsForFctToCall);
      return oldFunct.apply(this.caller, arguments);
    };
  }
};
