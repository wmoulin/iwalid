"use strict";

export default class ValidatorError extends Error {

  descriptor;

  /*
  * @param {?string} message - message de l'erreur.
  * @param {?Object} descriptor - descripteur de la validation.
  */
  constructor(message, descriptor) {

    let msg = typeof message === "string" ? message : undefined;
    let desc = descriptor && typeof message === "string" ? descriptor : !descriptor && typeof message !== "string" ? message : {};

    super(desc.message || msg);
    this.name = "ValidatorError";
    this.descriptor = desc;
  }

};
