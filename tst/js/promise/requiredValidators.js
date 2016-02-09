'use strict';

var User = require("./user");
var assert = require("assert");
import ValidatorHelper from "../../../src/js/helpers/ValidatorHelper";
import ValidatorLoader from "../../../src/js/validators-loader";
import {Promise} from "bluebird";


import fs from 'fs';

describe("Promise : Validation d'attribut obligatoire", function () {
  describe("User", function () {
    it("user should be valid", function () {
      var user = new User("name", "password");
      return Promise.resolve(user.__validatePromise__((e) => {assert.ifError(e);}));
    });

    it("user should be invalid", function () {
      var user = new User("name", undefined);
      return Promise.resolve(user.__validatePromise__((e) => {assert(e);}));
    });
  });
});

describe("Promise : Validation d'attribut obligatoire externalisée", function () {
  describe("User validation externalisée", function () {

    it("external", function () {
      var confExt = JSON.parse(fs.readFileSync( __dirname + "/validators.json", 'utf8'));
      var user = new User("name", "");

      ValidatorLoader.applyExternalConfValidator(confExt, user);
      return Promise.resolve(user.__validatePromise__((e) => {assert(e);}));
      return Promise.resolve(user.__validatePromise__((e) => {assert.ifError(e);}));
    });

  });
});
