"use strict";

export default class FieldValidator {
  static initField(target, key) {
    if (!target.valid) {
      target.valid = {};
    }

    if (!target.valid[key]) {
      target.valid[key] = [];
    }
  }
};
