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

// src/resources/states/index.ts
var states_exports = {};
__export(states_exports, {
  states: () => states
});
module.exports = __toCommonJS(states_exports);
var states = [
  { state_id: 11, abbreviation: "RO", name: "Rond\xF4nia", country: 1 },
  { state_id: 12, abbreviation: "AC", name: "Acre", country: 1 },
  { state_id: 13, abbreviation: "AM", name: "Amazonas", country: 1 },
  { state_id: 14, abbreviation: "RR", name: "Roraima", country: 1 },
  { state_id: 15, abbreviation: "PA", name: "Par\xE1", country: 1 },
  { state_id: 16, abbreviation: "AP", name: "Amap\xE1", country: 1 },
  { state_id: 17, abbreviation: "TO", name: "Tocantins", country: 1 },
  { state_id: 21, abbreviation: "MA", name: "Maranh\xE3o", country: 1 },
  { state_id: 22, abbreviation: "PI", name: "Piau\xED", country: 1 },
  { state_id: 23, abbreviation: "CE", name: "Cear\xE1", country: 1 },
  { state_id: 24, abbreviation: "RN", name: "Rio Grande do Norte", country: 1 },
  { state_id: 25, abbreviation: "PB", name: "Para\xEDba", country: 1 },
  { state_id: 26, abbreviation: "PE", name: "Pernambuco", country: 1 },
  { state_id: 27, abbreviation: "AL", name: "Alagoas", country: 1 },
  { state_id: 28, abbreviation: "SE", name: "Sergipe", country: 1 },
  { state_id: 29, abbreviation: "BA", name: "Bahia", country: 1 },
  { state_id: 31, abbreviation: "MG", name: "Minas Gerais", country: 1 },
  { state_id: 32, abbreviation: "ES", name: "Esp\xEDrito Santo", country: 1 },
  { state_id: 33, abbreviation: "RJ", name: "Rio de Janeiro", country: 1 },
  { state_id: 35, abbreviation: "SP", name: "S\xE3o Paulo", country: 1 },
  { state_id: 41, abbreviation: "PR", name: "Paran\xE1", country: 1 },
  { state_id: 42, abbreviation: "SC", name: "Santa Catarina", country: 1 },
  { state_id: 43, abbreviation: "RS", name: "Rio Grande do Sul", country: 1 },
  { state_id: 50, abbreviation: "MS", name: "Mato Grosso do Sul", country: 1 },
  { state_id: 51, abbreviation: "MT", name: "Mato Grosso", country: 1 },
  { state_id: 52, abbreviation: "GO", name: "Goi\xE1s", country: 1 },
  { state_id: 53, abbreviation: "DF", name: "Distrito Federal", country: 1 }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  states
});
