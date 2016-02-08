"use strict";

export default class ValidatorError extends Error {

  descriptor;

  /*
  * @param {?string} message - message de l'erreur.
  * @param {?Object} errors - tableau d'erreurs de validation.
  */
  constructor(message, errors) {

    let msg = typeof message === "string" ? message : "Error during validation";
    let errs = errors && typeof message === "string" ? errors : !errors && typeof message !== "string" ? message : {};

    super(msg);
    this.name = "ValidationError";
    this.errors = errs;
  }

};
