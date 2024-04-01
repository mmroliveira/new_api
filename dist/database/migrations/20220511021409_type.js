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

// src/database/migrations/20220511021409_type.ts
var type_exports = {};
__export(type_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(type_exports);
function up(knex) {
  return __async(this, null, function* () {
    return knex.schema.createTable("type", function(table) {
      table.increments("type_id").primary().notNullable();
      table.string("name").notNullable();
      table.boolean("active_type").notNullable().defaultTo(true);
      table.timestamp("created_at", { precision: 0 }).defaultTo(knex.fn.now(0));
      table.timestamp("updated_at", { precision: 0 }).defaultTo(knex.fn.now(0));
    });
  });
}
function down(knex) {
  return __async(this, null, function* () {
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
