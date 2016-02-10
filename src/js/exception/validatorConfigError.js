"use strict";

/*
* Erreur lancé lors d'un problème de configuration du validateur
* @param {?string} message - message de l'erreur.
* @param {?Object} descriptor - descripteur de la validation.
*/
export default function ValidatorConfigError(message, descriptor) {
  let msg = typeof message === "string" ? message : undefined;
  let desc = descriptor && typeof message === "string" ? descriptor : !descriptor && typeof message !== "string" ? message : {};

  this.message = msg;
  this.name = "ValidatorConfigError";
  this.descriptor = desc;
  Error.captureStackTrace(this, ValidatorConfigError);
};
ValidatorConfigError.prototype = Object.create(Error.prototype);
ValidatorConfigError.prototype.constructor = ValidatorConfigError;
