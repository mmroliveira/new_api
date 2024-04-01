"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// knexfile.js
var require_knexfile = __commonJS({
  "knexfile.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      development: {
        client: "pg",
        connection: {
          database: "globalmax",
          user: "postgres",
          password: "qwer"
        },
        migrations: {
          directory: "./src/database/migrations"
        },
        seeds: {
          directory: "./src/database/seeds"
        }
      },
      production: {
        client: "pg",
        connection: {
          database: "finance_l8yh",
          user: "finance_l8yh_user",
          password: "XtC2uzD5taaikr3iVsk78OoaMs8RvUAz"
        },
        pool: {
          min: 2,
          max: 10
        },
        migrations: {
          directory: "./dist/src/database/migrations"
        },
        seeds: {
          directory: "./dist/src/database/seeds"
        }
      }
    };
  }
});

// src/controllers/users/index.ts
var users_exports = {};
__export(users_exports, {
  UserController: () => UserController
});
module.exports = __toCommonJS(users_exports);

// src/database/connection.ts
var import_knex = __toESM(require("knex"));
var import_knexfile = __toESM(require_knexfile());
var environment = process.env.DB_ENV || "development";
var database = (0, import_knex.default)(import_knexfile.default[environment]);

// src/controllers/users/index.ts
var import_uniqid = __toESM(require("uniqid"));
var UserController = class {
  async create(request, response) {
    const {
      user_name,
      password,
      name,
      cpf,
      pis,
      occupation,
      birth_date,
      admission_date
    } = request.body;
    try {
      const [userExists] = await database.select("*").from("users").where({
        user_name
      });
      if (userExists) {
        return response.handleError("User already exists", 400);
      }
    } catch (error) {
      console.log(error);
      return response.handleError("Internal server error", 500);
    }
    const user_id = (0, import_uniqid.default)();
    try {
      await database("users").insert({
        user_id,
        user_name,
        password,
        name,
        cpf,
        pis,
        occupation,
        birth_date,
        admission_date,
        photo_url: ""
      });
      return response.json({ message: "User registered successfully" });
    } catch (error) {
      return response.handleError("Internal server error", 500);
    }
  }
  async authenticate(request, response) {
    const { user_name, password } = request.body;
    try {
      const [user] = await database.select("*").from("users").where({
        user_name
      });
      if (user === null) {
        return response.handleError("Username or password invalid!", 400);
      }
      const jwtSecret = process.env.JWT_SECRET;
      return response.json({
        user: {
          name: user.name,
          user_name: user.user_name,
          user_id: user.user_id,
          photo_url: user.photo_url
        }
        //token: token,
      });
    } catch (error) {
      return response.handleError("Internal server error", 500);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserController
});
