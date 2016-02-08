"use strict";

import Promise from 'bluebird';

/**
* Decorateur pour ajouter une conversion des paramètres de méthode
*/
export default function convert(ConvertClass) {
  return function(target, key, descriptor) {

    descriptor.value.convert = function(obj) {

      let instance = new ConvertClass();
      if (obj) {
        for (var prop in obj) {
          if (instance.hasOwnProperty(prop) && typeof instance[prop] != 'function') {
            instance[prop] = obj[prop];
          }
        }
      }
      return instance;
    };
  };
};
