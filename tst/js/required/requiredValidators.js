'use strict';

var User = require("./user");
var assert = require("assert");
import ValidatorHelper from "../../../src/js/helpers/ValidatorHelper";
import ValidatorLoader from "../../../src/js/validators-loader";

import fs from 'fs';

describe("Validation d'attribut obligatoire", function () {
  describe("User", function () {
    it("user should be valid", function () {
      var user = new User("name", "password");
      assert.doesNotThrow(() => user.__validate__(), Error);
    });

    it("user should be invalid", function () {
      var user = new User("name", undefined);
      assert.throws(() => user.__validate__(), Error);
    });
  });
});

describe("Validation d'attribut obligatoire externalisée", function () {
  describe("User validation externalisée", function () {
   
    it("external", function () {
      var confExt = JSON.parse(fs.readFileSync( __dirname + "/validators.json", 'utf8'));
      var user = new User("name", "");
     
      ValidatorLoader.applyExternalConfValidator(confExt, user);
      assert.throws(() => user.__validate__(), Error);
      assert.doesNotThrow(() => user.__validate__(), Error);
    });
    
  });
});