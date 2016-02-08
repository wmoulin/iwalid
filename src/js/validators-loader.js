"use strict";
import validate from "./validators";
import patternValidators from "./validators/patternValidators";
import * as requiredValidators from "./validators/requiredValidators";
import ValidatorHelper from "./helpers/ValidatorHelper"

const validatorKey = "__validator__";
const validatorInstanceKey = "__instance__";
const validatorPropertiesKey = "__properties__";

export default class ValidMod {

  constructor() {
  }

  /**
  * Lance la validation à partir d'un objet de validation.
  * @param {instance} objet à valider.
  * @param {validation} description des validateur à appliquer.
  */
  static validate(instance, validation) {

    let validToApply = validation || instance.__validation__;

    for (var attrib in validToApply) {
      validToApply[attrib].forEach((validator) => {
        validator.bind(target)(target[attrib]);
      });
    }
  }

  /**
  * Charge les validateurs pour les utiliser lors d'une validation avec config externe.
  */
  static init() {
    let validators = Object.assign({}, loadValidators(validate));
    validators = Object.assign(validators, loadValidators(patternValidators));
    validators = Object.assign(validators, loadValidators(requiredValidators));
    ValidMod.validators = validators;
  }

  /**
  * Charge une configuration externe de validation, sauvegarde l'ancienne pour la restituer.
  * @param {Object} conf - description des validateur à appliquer.
  * @param {Object} target - objet à valider.
  * @param {Object} parent - intance parent de l'objet à valider.
  * @param {Object} property - nom de l'attribut dans l'intance parent.
  */
  static applyExternalConfValidator(conf, target, parent, property) {

    target.constructor.__prevValidation__ = target.constructor.__validation__ || {};
    target.constructor.__validation__ = {};

    if (typeof conf == "object" && conf[validatorKey]) {

      if (!target.validate) {
        ValidMod.validators["validate"](target.constructor);
      }

      let validators = conf[validatorKey];

      if (validators[validatorInstanceKey] && parent && property) {
        addArrayValidators(parent, property, validators[validatorInstanceKey]);
      }

      if (validators[validatorPropertiesKey]) {
        for(var propertyToValidate in validators[validatorPropertiesKey]) {

        if (typeof validators[validatorPropertiesKey][propertyToValidate] == "object" && !Array.isArray(validators[validatorPropertiesKey][propertyToValidate])) {
            ValidMod.applyExternalConfValidator(validators[validatorPropertiesKey][propertyToValidate], target[propertyToValidate], target, propertyToValidate);
          } else if (Array.isArray(validators[validatorPropertiesKey][propertyToValidate])) {
            addArrayValidators(target, propertyToValidate, validators[validatorPropertiesKey][propertyToValidate]);
          }
        }

      }
    }
  }
};

ValidMod.validators = {};
ValidMod.init();
ValidMod.globalConf = undefined;

function loadValidators(validators) {
  let properties = Object.getOwnPropertyNames(validators);
  let validateFct = {};
  if (typeof validators == 'function') {
    validateFct[validators.name] = validators;
  } else {
    for(let property in properties) {
      if (typeof validators[properties[property]] == 'function') {
        validateFct[validators[properties[property]].name] = validators[properties[property]];
      }
    }
  }
  return validateFct;
};


function addArrayValidators(target, property, arrayValidators) {
  arrayValidators.forEach((validator) => {
    if (typeof validator === "string" || validator instanceof String) {
      ValidMod.validators[validator]()(target, property);
    } else if (typeof validator == "Object") {
      ValidMod.validators[validator.name](validator.args)(target, property);
    }
  });
};
