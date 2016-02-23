"use strict";

export default class ValidatorConfiguration {

  constructor(obj) {

    this.index = undefined;
    this.groupIndex = undefined;
    this.propName = undefined;
    this.stopOnError = false;
    this.nextOnError = true;
    this.message = false;
    this.extra = undefined;

    if (obj) {
      for (var prop in this) {
        if (obj[prop] != undefined){
          this[prop] = obj[prop];
        }
      }
    }
  }

};
