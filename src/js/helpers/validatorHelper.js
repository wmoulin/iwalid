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
};

