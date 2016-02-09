"use strict";

export default class ValidatorConfiguration {

  constructor(obj) {

    this.index = undefined;
    this.propName = undefined;
    this.fieldId = undefined;
    this.messageId = undefined;
    this.message = undefined;
    this.stopOnError = false;
    this.nextOnError = false;

    if (obj) {
      for (var prop in this) this[prop] = obj[prop];
    }
  }

};
