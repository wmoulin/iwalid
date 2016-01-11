"use strict";
import logger from "../logger";
import path from "path";
import fs from 'fs';
import _  from "lodash";

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
  * Test si un fichier existe
  * @param {String} dir repertoire dans lequel doit se trouver le fichier
  * @param {String} fileName nom du fichier
  * @param {Boolean} mandatory le fichier est obligatoire (stop le processus)
  */
  static checkFileExist(dir, fileName, mandatory) {
    logger.info("dir : ", dir, " fileName : ", fileName);
    var completFilePath = path.join(dir, fileName);
    if (!fs.existsSync(completFilePath)) {
      if (!mandatory) return undefined;
      logger.error("Le projet doit avoir un fichier " + fileName + " (dir=" + dir + ")");
      process.exit(1);
    }
    return completFilePath;
  }

  /**
  * Concatene deux repertoire en ajoutant le séparateur
  * @param {Array<String>} dirs les répertoires
  * @return {String} tous les répertoires concaténé avec le séparateur
  */
  static concatDirectory(dirs) {
    logger.info("dirs : ", dirs);
    if (!_.isArray(dirs)) {
      logger.error("Le paramàtre doit être un tableau de string (dirs=" + dirs + ")");
      process.exit(1);
    }

    var pathDir = "";
    dirs.forEach(function (dir) {
      pathDir = path.join(pathDir, dir);
    });
    return pathDir;
  }

  /**
  * Charge un fichier JSON
  * @param {String} chemin du fichier
  * @return {Object} l'objet Json dans le fichier
  */

  static loadJsonFile(jsonFile) {
    logger.info("load jsonFile : ", jsonFile);
    if (fs.existsSync(jsonFile)) {
      return require(jsonFile);
    }
  }
};

