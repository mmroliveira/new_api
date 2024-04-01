"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/configs/multer.ts
var multer_exports = {};
__export(multer_exports, {
  multerConfig: () => multerConfig
});
module.exports = __toCommonJS(multer_exports);
var import_multer = __toESM(require("multer"));
var import_crypto = __toESM(require("crypto"));
var multerConfig = {
  // dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: import_multer.default.diskStorage({
    filename: (req, file, cb) => {
      import_crypto.default.randomBytes(16, (error, hash) => {
        if (error) {
          cb(error, "failed to generate name");
        }
        const fileName = `${hash.toString("hex")}-${file.originalname}`;
        cb(null, fileName);
      });
    }
    // destination: (req, file, cb) => {
    //   cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    // },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type "));
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  multerConfig
});
