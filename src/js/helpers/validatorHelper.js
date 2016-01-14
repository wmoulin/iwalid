"use strict";
import path from "path";
import fs from 'fs';

export default class ValidatorHelper {
  /**
  * Ajout les attributs nécessaires au module de validation.
  * @param {target} instance de l'objet à valider.
  * @param {key} nom de l'attribut concerné par la validation.
  */
  static initField(target, key) {
    if (!target.valid) {
      target.valid = {};
    }
    
    if (!target.valid[key]) {
      target.valid[key] = [];
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
  * Ajout les attributs nécessaires au module de validation.
  * @param {target} instance de l'objet à valider.
  * @param {key} nom de l'attribut concerné par la validation.
  * @param {fctToCall} fonction à appeler pour la validation de l'attribut.
  * @param {extraParameters} complément de paramètres pour la fonction.
  */
  static applyValidatorOnProperty(targetClass, key, fctToCall, ...extraParameters) {
    targetClass.valid[key].push(function (value) {
      var argsForFctToCall = [value, [key]];
      if (extraParameters) {
        argsForFctToCall = argsForFctToCall.concat(extraParameters);
      }
      fctToCall.apply(this.caller, argsForFctToCall);
    });
  }
  
  /**
  * Ajout les attributs nécessaires au module de validation.
  * @param {descriptor} descripteur de la fonction.
  * @param {paramIdxs} tableau des indexes des paramètres concerné par le décorateur.
  * @param {fctToCall} fonction à appeler pour chaque paramètre.
  * @param {extraParameters} complément de paramètres pour la fonction.
  */
  static applyValidatorOnFunction(descriptor, paramIdxs, fctToCall, extraParameters) {
    let oldFunct = descriptor.value;
    descriptor.value = function() {
      paramIdxs.forEach((paramIdx) => {
        var argsForFctToCall = [arguments[paramIdx], ["paramter index", paramIdxs]];
        if (extraParameters) {
          argsForFctToCall = argsForFctToCall.concat(extraParameters);
        }
        fctToCall.apply(this.caller, argsForFctToCall);
      });
      return oldFunct.apply(this.caller, arguments);
    };

  }  
};

