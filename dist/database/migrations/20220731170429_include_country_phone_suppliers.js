"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/database/migrations/20220731170429_include_country_phone_suppliers.ts
var include_country_phone_suppliers_exports = {};
__export(include_country_phone_suppliers_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(include_country_phone_suppliers_exports);
function up(knex) {
  return __async(this, null, function* () {
    return knex.schema.table("suppliers", (table) => {
      table.integer("fk_country_cell");
      table.integer("fk_country_phone");
      table.foreign("fk_country_cell").references("country_id").inTable("countries");
      table.foreign("fk_country_phone").references("country_id").inTable("countries");
    });
  });
}
function down(knex) {
  return __async(this, null, function* () {
    return knex.schema.table("suppliers", (table) => {
      table.dropColumn("fk_country_cell");
      table.dropColumn("fk_country_phone");
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
