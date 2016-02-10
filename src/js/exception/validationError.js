"use strict";

/*
* Erreur lancé lors en fin de validation et regroupant toutes les erreurs de validation
* @param {?string} message - message de l'erreur.
* @param {Array} errors - listes des erreurs de validation.
*/
export default function ValidationError(message, errors) {
  let msg = typeof message === "string" ? message : "Error during validation";
  let errs = errors && typeof message === "string" ? errors : !errors && typeof message !== "string" ? message : [];

  this.message = msg;
  this.name = "ValidationError";
  this.errors = errs;
  Error.captureStackTrace(this, ValidationError);
};
ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;
