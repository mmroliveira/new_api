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

// src/middlewares/authenticate.ts
var authenticate_exports = {};
__export(authenticate_exports, {
  ensureAuthenticateUser: () => ensureAuthenticateUser
});
module.exports = __toCommonJS(authenticate_exports);
var import_jsonwebtoken = require("jsonwebtoken");
function ensureAuthenticateUser(request, response, next) {
  return __async(this, null, function* () {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ message: "Token missing" });
    }
    const [, token] = authHeader.split(" ");
    const jwt_token_secret = process.env.JWT_SECRET;
    if (!jwt_token_secret) {
      return response.status(500).json({ message: "Internal error server" });
    }
    try {
      const { sub } = (0, import_jsonwebtoken.verify)(token, jwt_token_secret);
      request.user_id = sub;
      return next();
    } catch (error) {
      return response.status(401).json({ message: "Invalid token" });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ensureAuthenticateUser
});
