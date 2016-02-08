"use strict";

export default class ValidatorConfigError extends Error {
  
  descriptor;

  /*
  * @param {?string} message - message de l'erreur.
  * @param {?Object} descriptor - descripteur de la propriété (attribut / fonction).
  */
  constructor(message, descriptor) {
  
    let msg = typeof message === "string" ? message : undefined;
    let desc = descriptor && typeof message === "string" ? descriptor : !descriptor && typeof message !== "string" ? message : {};
    
    super(msg);
    this.name = "ValidatorConfigError";
    this.descriptor = desc;
  }

};
