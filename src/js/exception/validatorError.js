"use strict";

/*
* Erreur lancé lors d'une erreur de validation
* @param {?string} message - message de l'erreur.
* @param {?Object} descriptor - descripteur de la validation.
*/
export default function ValidatorError(message, descriptor) {
  let msg = typeof message === "string" ? message : undefined;
  let desc = descriptor && typeof message === "string" ? descriptor : !descriptor && typeof message !== "string" ? message : {};

  this.message = msg;
  this.name = "ValidatorError";
  this.descriptor = desc;
  Error.captureStackTrace(this, ValidatorError);
};
ValidatorError.prototype = Object.create(Error.prototype);
ValidatorError.prototype.constructor = ValidatorError;
