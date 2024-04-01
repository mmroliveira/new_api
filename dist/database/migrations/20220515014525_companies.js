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

// src/database/migrations/20220515014525_companies.ts
var companies_exports = {};
__export(companies_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(companies_exports);
async function up(knex) {
  return knex.schema.createTable("companies", function(table) {
    table.increments("company_id").primary().notNullable();
    table.integer("fk_type_id").notNullable();
    table.string("register").notNullable().unique();
    table.string("name").notNullable();
    table.string("fantasy_name");
    table.integer("fk_country_id");
    table.integer("fk_state_id");
    table.integer("fk_city_id");
    table.string("street");
    table.string("neighborhood");
    table.string("number");
    table.string("zip_code");
    table.string("phone");
    table.string("cell");
    table.string("state_registration");
    table.string("logo_url");
    table.foreign("fk_type_id").references("type_id").inTable("type");
    table.foreign("fk_country_id").references("country_id").inTable("countries");
    table.foreign("fk_state_id").references("state_id").inTable("states");
    table.foreign("fk_city_id").references("city_id").inTable("cities");
    table.boolean("active_company").notNullable().defaultTo(true);
    table.timestamp("created_at", { precision: 0 }).defaultTo(knex.fn.now(0));
    table.timestamp("updated_at", { precision: 0 }).defaultTo(knex.fn.now(0));
  });
}
async function down(knex) {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
