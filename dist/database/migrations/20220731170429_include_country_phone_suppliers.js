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

// src/database/migrations/20220731170429_include_country_phone_suppliers.ts
var include_country_phone_suppliers_exports = {};
__export(include_country_phone_suppliers_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(include_country_phone_suppliers_exports);
async function up(knex) {
  return knex.schema.table("suppliers", (table) => {
    table.integer("fk_country_cell");
    table.integer("fk_country_phone");
    table.foreign("fk_country_cell").references("country_id").inTable("countries");
    table.foreign("fk_country_phone").references("country_id").inTable("countries");
  });
}
async function down(knex) {
  return knex.schema.table("suppliers", (table) => {
    table.dropColumn("fk_country_cell");
    table.dropColumn("fk_country_phone");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
