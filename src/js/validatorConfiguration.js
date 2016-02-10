"use strict";

export default class ValidatorConfiguration {

  constructor(obj) {

    this.index = undefined;
    this.propName = undefined;
    this.stopOnError = false;
    this.nextOnError = false;
    this.message = false;
    this.extra = undefined;

    if (obj) {
      for (var prop in this) this[prop] = obj[prop];
    }
  }

};
