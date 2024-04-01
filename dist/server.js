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

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.4.5",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        "test:coverage": "tap --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    "use strict";
    var fs2 = require("fs");
    var path = require("path");
    var os = require("os");
    var crypto2 = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment2 = uri.searchParams.get("environment");
      if (!environment2) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment2.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs2.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
      }
      if (fs2.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path2 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs2.readFileSync(path2, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path2} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto2.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/dotenv/lib/env-options.js"(exports2, module2) {
    "use strict";
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module2.exports = options;
  }
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/dotenv/lib/cli-options.js"(exports2, module2) {
    "use strict";
    var re = /^dotenv_config_(encoding|path|debug|override|DOTENV_KEY)=(.+)$/;
    module2.exports = function optionMatcher(args) {
      return args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
    };
  }
});

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

// node_modules/dotenv/config.js
(function() {
  require_main().config(
    Object.assign(
      {},
      require_env_options(),
      require_cli_options()(process.argv)
    )
  );
})();

// src/server.ts
var import_express2 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_morgan = __toESM(require("morgan"));

// src/helpers/handleError.ts
var handleError = (request2, response, next) => {
  response.handleError = function(message, status) {
    return this.status(status).send({ message });
  };
  next();
};

// src/routes.ts
var import_express = require("express");
var import_multer2 = __toESM(require("multer"));

// src/configs/multer.ts
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

// src/database/connection.ts
var import_knex = __toESM(require("knex"));
var import_knexfile = __toESM(require_knexfile());
var environment = process.env.DB_ENV || "development";
var database = (0, import_knex.default)(import_knexfile.default[environment]);

// src/controllers/users/index.ts
var import_uniqid = __toESM(require("uniqid"));
var UserController = class {
  create(request2, response) {
    return __async(this, null, function* () {
      const {
        user_name,
        password,
        name,
        cpf,
        pis,
        occupation,
        birth_date,
        admission_date
      } = request2.body;
      try {
        const [userExists] = yield database.select("*").from("users").where({
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
        yield database("users").insert({
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
    });
  }
  authenticate(request2, response) {
    return __async(this, null, function* () {
      const { user_name, password } = request2.body;
      try {
        const [user] = yield database.select("*").from("users").where({
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
    });
  }
};

// src/controllers/countries/index.ts
var CountriesController = class {
  create(request2, response) {
    return __async(this, null, function* () {
      try {
        const { name, abbreviation } = request2.body;
        const [countryExists] = yield database.select("*").from("countries").where({
          abbreviation
        });
        if (countryExists) {
          return response.handleError("Country already exists", 400);
        }
        const [result] = yield database("countries").insert({
          name,
          abbreviation
        }).returning("*");
        return response.json({ result });
      } catch (error) {
        return response.handleError("Internal server error", 500);
      }
    });
  }
  list(request2, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database("countries").select("*");
        let selectCountry = result.map((item) => {
          return {
            id: item.country_id,
            value: item.country_id,
            label: item.name
          };
        });
        selectCountry.unshift({ id: "", value: "", label: "" });
        return response.json(selectCountry);
      } catch (error) {
        return response.handleError("Internal server error", 500);
      }
    });
  }
};

// src/controllers/receipts/index.ts
var import_moment = __toESM(require("moment"));

// src/resources/receipts/index.ts
var import_extenso = __toESM(require("extenso"));
var GenerateReceipts = class {
  getFonts() {
    const fonts = {
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique"
      }
    };
    return fonts;
  }
  generate(company, payer, receiver, receipt, city, state, currency) {
    return __async(this, null, function* () {
      function getHeader() {
        const header2 = {
          margin: 10,
          columns: [
            {
              table: {
                widths: ["50%", "50%"],
                headerRows: 1,
                body: [
                  [
                    {
                      image: receipt.fk_company_id === 1 ? "./src/resources/receipts/assets/globalmax.png" : receipt.fk_company_id === 2 ? "./src/resources/receipts/assets/laca.png" : "./src/resources/receipts/assets/preformax.png",
                      width: 200,
                      height: 80
                    },
                    {
                      ol: [
                        {
                          text: `${company.name}`,
                          style: "text",
                          listType: "none"
                        },
                        {
                          text: `Rua ${company.street}, N\xBA ${company.number} \u2013 ${company.neighborhood}`,
                          style: "text",
                          listType: "none"
                        },
                        {
                          text: `${city} / ${state} ${company.zip_code !== null ? `\u2013 CEP: ${company.zip_code}` : ""}`,
                          style: "text",
                          listType: "none"
                        },
                        {
                          text: `Telefone: ${company.phone}`,
                          listType: "none",
                          style: "text"
                        },
                        {
                          text: `${receipt.fk_company_id === 3 ? `RUC ${company.register}` : `CNPJ ${company.register}`}`,
                          listType: "none",
                          style: "text"
                        },
                        {
                          text: `${company.state_registration !== null ? `Insc. Est. ${company.state_registration}` : ""}`,
                          listType: "none",
                          style: "text"
                        }
                      ],
                      alignment: "right"
                    }
                  ]
                ]
              },
              layout: "noBorders"
            }
          ]
        };
        return header2;
      }
      function getContentId() {
        const contentId2 = [
          {
            // Parte do numero do recibo e QRcode
            alignment: "center",
            style: "contentId",
            columns: [
              {
                table: {
                  widths: ["50%", "50%"],
                  body: [
                    [
                      {
                        ol: [
                          {
                            text: `
Recibo: ${receipt.receipt_id}`,
                            listType: "none",
                            style: "title"
                          },
                          {
                            text: `

Valor: ${currency.abbreviation} ${receipt.amount}`,
                            listType: "none",
                            style: "title"
                          }
                        ]
                      },
                      {
                        qr: `${process.env.BASE_URL}/receipts/${receipt.receipt_id}`
                      }
                    ]
                  ]
                },
                layout: "noBorders"
              }
            ]
          }
        ];
        return contentId2;
      }
      function getContentDescription(valueText) {
        const description = [
          {
            // Parte dos dados do recibo
            style: "tableContent",
            columns: [
              { width: "10%", text: "" },
              {
                table: {
                  widths: ["25%", "75%"],
                  body: [
                    [
                      { text: "Recebi(emos) da", style: "tableTitle" },
                      {
                        text: `${payer.name}`,
                        style: "tableText"
                      }
                    ],
                    [
                      { text: "Referente", style: "tableTitle" },
                      {
                        text: `${receipt.regarding}`,
                        style: "tableText"
                      }
                    ],
                    [
                      { text: "A import\xE2ncia de", style: "tableTitle" },
                      {
                        text: `${currency.abbreviation} ${receipt.amount} (${valueText})`,
                        style: "tableText"
                      }
                    ],
                    [
                      { text: "Colaborador", style: "tableTitle" },
                      {
                        text: `${receiver.name}`,
                        style: "tableText"
                      }
                    ]
                  ]
                }
              },
              { width: "10%", text: "" }
            ]
          }
        ];
        return description;
      }
      function getContentSignature() {
        const contentSignature2 = [
          {
            // Parte da assinatura
            columns: [
              { width: "10%", text: "" },
              {
                style: "signatureContent",
                alignment: "center",
                table: {
                  widths: ["100%"],
                  body: [
                    ["_________________________________________"],
                    [{ text: `
${receiver.name}` }],
                    [
                      {
                        text: `${receiver.register}`
                      }
                    ]
                  ]
                },
                layout: "noBorders"
              },
              { width: "10%", text: "" }
            ]
          }
        ];
        return contentSignature2;
      }
      function getContentLocalization() {
        const contentLocalization2 = [
          {
            // Parte da cidade e data
            style: "localizationContent",
            columns: [
              { width: "10%", text: "" },
              {
                alignment: "center",
                table: {
                  widths: ["100%"],
                  body: [
                    [
                      {
                        text: `${city} - ${state}`
                      }
                    ],
                    [
                      {
                        text: `${receipt.date}`
                      }
                    ]
                  ]
                },
                layout: "noBorders"
              },
              { width: "10%", text: "" }
            ]
          }
        ];
        return contentLocalization2;
      }
      function convertCurrencies(value2) {
        if (currency.currency_id === 2) {
          value2 = value2.replace("real", "d\xF3lar");
          value2 = value2.replace("reais", "d\xF3lares");
          value2 = value2.replace("centavo", "cent");
          value2 = value2.replace("centavos", "cents");
          return value2;
        } else if (currency.currency_id === 3) {
          value2 = value2.replace("real", "guaran\xED");
          value2 = value2.replace("reais", "guaran\xEDes");
          return value2;
        } else {
          return value2;
        }
      }
      let value = (0, import_extenso.default)(receipt.amount, {
        mode: "currency"
      });
      value = convertCurrencies(value);
      const header = getHeader();
      const contentId = getContentId();
      const contentDescription = getContentDescription(value);
      const contentSignature = getContentSignature();
      const contentLocalization = getContentLocalization();
      const docDefinitions = {
        defaultStyle: { font: "Helvetica" },
        pageSize: "LEGAL",
        pageMargins: [40, 100, 40, 60],
        header,
        content: [
          contentId,
          contentDescription,
          contentSignature,
          contentLocalization
        ],
        styles: {
          text: {
            fontSize: 10,
            margin: [0, 0, 0, 4]
          },
          contentId: {
            margin: [0, 100, 0, 0]
          },
          tableContent: {
            margin: [0, 80, 0, 0]
          },
          tableTitle: {
            margin: [2, 2, 2, 2],
            alignment: "center",
            bold: true
          },
          tableText: {
            alignment: "left",
            margin: [2, 2, 2, 2]
          },
          signatureContent: {
            margin: [0, 150, 0, 0]
          },
          localizationContent: {
            margin: [0, 150, 0, 0]
          },
          title: {
            fontSize: 18,
            bold: true
          }
        }
      };
      return docDefinitions;
    });
  }
};

// src/controllers/receipts/index.ts
var yup = __toESM(require("yup"));
var import_pdfmake = __toESM(require("pdfmake"));
var ReceiptsController = class {
  create(request2, response) {
    return __async(this, null, function* () {
      try {
        const {
          fk_company_id,
          payer,
          receiver,
          amount,
          date,
          regarding,
          created_by,
          currency,
          fk_nature_id,
          fk_cost_center_id
        } = request2.body;
        const fk_status_id = 1;
        const [company] = yield database.select("*").from("companies").where({
          company_id: fk_company_id
        });
        if (company === null) {
          return response.status(400).json({ message: "Company does not exist" });
        }
        const [payerExists] = yield database.select("*").from("suppliers").where({
          supplier_id: payer
        });
        if (payerExists === null) {
          return response.status(400).json({ message: "Payer does not exist" });
        }
        const [receiverExists] = yield database.select("*").from("suppliers").where({
          supplier_id: receiver
        });
        if (receiverExists === null) {
          return response.status(400).json({ message: "Receiver does not exist" });
        }
        const receipt = yield database("receipts").insert({
          amount,
          regarding,
          fk_status_id,
          fk_company_id: company.company_id,
          payer: payerExists.supplier_id,
          receiver: receiverExists.supplier_id,
          date: (0, import_moment.default)(date).format("DD/MM/YYYY"),
          created_by,
          currency,
          fk_nature_id,
          fk_cost_center_id
        });
        return response.status(200).json({ message: "Receipt registered successfully" });
      } catch (error) {
        console.log(error);
        return response.status(400).json({ message: error });
      }
    });
  }
  update(request2, response) {
    return __async(this, null, function* () {
      try {
        const {
          fk_company_id,
          payer,
          receiver,
          amount,
          date,
          regarding,
          created_by,
          currency
        } = request2.body;
        console.log("cu", currency);
        const { receipt_id } = request2.params;
        const fk_status_id = 1;
        const [company] = yield database.select("*").from("companies").where({
          company_id: fk_company_id
        });
        if (company === null) {
          return response.status(400).json({ message: "Company does not exist" });
        }
        const [payerExists] = yield database.select("*").from("suppliers").where({
          supplier_id: payer
        });
        if (payerExists === null) {
          return response.status(400).json({ message: "Payer does not exist" });
        }
        const [receiverExists] = yield database.select("*").from("suppliers").where({
          supplier_id: receiver
        });
        if (receiverExists === null) {
          return response.status(400).json({ message: "Receiver does not exist" });
        }
        const receipt = yield database.where({ receipt_id }).update({
          amount,
          regarding,
          fk_status_id,
          fk_company_id: company.company_id,
          payer: payerExists.supplier_id,
          receiver: receiverExists.supplier_id,
          date: (0, import_moment.default)(date).format("DD/MM/YYYY"),
          created_by,
          currency
        }).table("receipts");
        return response.status(200).json({ message: "Receipt updated successfully" });
      } catch (error) {
        console.log(error);
        return response.status(400).json({ message: error });
      }
    });
  }
  list(request2, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database.select([
          "receipts.receipt_id as id",
          "fk_company_id",
          "amount",
          "regarding",
          "receipts.date",
          "payer.name as payer",
          "receiver.name as receiver",
          "currency.abbreviation"
        ]).orderBy("id", "asc").table("receipts").innerJoin("suppliers as payer", "payer", "payer.supplier_id").where("active_receipt", true).leftJoin("suppliers as receiver", "receiver", "receiver.supplier_id").leftJoin("currency as currency", "currency", "currency.currency_id").where("active_receipt", true);
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal server error", 500);
      }
    });
  }
  view(request2, response) {
    return __async(this, null, function* () {
      const { receipt_id } = request2.params;
      try {
        const result = yield database.select([
          "receipts.receipt_id as id",
          "fk_company_id",
          "amount",
          "regarding",
          "date",
          "payer as fk_payer_id",
          "receiver as fk_receiver_id",
          "payer.name as payer",
          "receiver.name as receiver",
          "company.name as company_name",
          "country.name as company_country",
          "state.abbreviation as company_state",
          "city.name as company_city",
          "company.neighborhood as company_neighborhood",
          "company.street as company_street",
          "company.number as company_number",
          "company.zip_code as company_zip_code",
          "company.phone as company_phone",
          "company.register as company_register",
          "company.state_registration as company_state_registration",
          "currency.abbreviation as abbreviation",
          "currency.name as currency",
          "currency.currency_id as fk_currency_id",
          "nature.name as nature",
          "nature.nature_id as fk_nature_id",
          "cost_center.name as cost_center",
          "cost_center.cost_center_id as fk_cost_center_id"
        ]).table("receipts").where("receipt_id", receipt_id).join("suppliers as payer", "payer", "payer.supplier_id").join("suppliers as receiver", "receiver", "receiver.supplier_id").join("companies as company", "fk_company_id", "company.company_id").join("countries as country", "company.fk_country_id", "country.country_id").join("states as state", "company.fk_state_id", "state.state_id").join("cities as city", "company.fk_city_id", "city.city_id").join("nature", "fk_nature_id", "nature.nature_id").join("cost_center", "fk_cost_center_id", "cost_center.cost_center_id").join("currency as currency", "currency", "currency.currency_id");
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal server error", 500);
      }
    });
  }
  delete(request2, response) {
    return __async(this, null, function* () {
      const { receipt_id } = request2.params;
      const schema = yup.object().shape({
        receipt_id: yup.number().integer()
      });
      try {
        yield schema.validate({ receipt_id });
      } catch (error) {
        return response.status(400).json({
          validate: false,
          message: error.errors
        });
      }
      try {
        const [existReceipt] = yield database("receipts").select("*").where({ receipt_id });
        if (!existReceipt) {
          return response.status(400).json({
            message: "Receipt not exists"
          });
        }
        if (existReceipt.active_receipt === false) {
          return response.status(202).json({
            message: "provider has already been deleted"
          });
        }
      } catch (error) {
        console.log(error);
        return response.status(400).json({ validate: false, message: "Internal error server" });
      }
      try {
        const result = yield database("receipts").update({ active_receipt: 0 }).where({ receipt_id }).returning("*");
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.status(500).json({
          message: "Internal error server"
        });
      }
    });
  }
  get(request2, response) {
    return __async(this, null, function* () {
      try {
        const { id } = request2.params;
        const [receipt] = yield database.select("*").from("receipts").where({
          receipt_id: parseInt(id)
        });
        if (receipt === null) {
          return response.handleError("Receipt does not exist", 400);
        }
        const [company] = yield database.select("*").from("companies").where({
          company_id: receipt.fk_company_id
        });
        if (company === null) {
          return response.handleError("Bad request", 400);
        }
        const [state] = yield database.select("abbreviation").from("states").where({
          state_id: company.fk_state_id
        });
        if (state === null) {
          return response.handleError("Bad request", 400);
        }
        const [city] = yield database.select("name").from("cities").where({
          city_id: company.fk_city_id
        });
        if (city === null) {
          return response.handleError("Bad request", 400);
        }
        const [payer] = yield database.select("*").from("suppliers").where({
          supplier_id: receipt.payer
        });
        if (payer === null) {
          return response.handleError("Bad request", 400);
        }
        const [receiver] = yield database.select("*").from("suppliers").where({
          supplier_id: receipt.receiver
        });
        if (receiver === null) {
          return response.handleError("Bad request", 400);
        }
        const [currency] = yield database.select("*").from("currency").where({
          currency_id: receipt.currency
        });
        if (currency === null) {
          return response.handleError("Bad request", 400);
        }
        const generateReceipts = new GenerateReceipts();
        const fonts = generateReceipts.getFonts();
        const docDefinitions = yield generateReceipts.generate(
          company,
          payer,
          receiver,
          receipt,
          city.name,
          state.abbreviation,
          currency
        );
        const printer = new import_pdfmake.default(fonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinitions);
        const chunks = [];
        pdfDoc.on("data", (chunk) => {
          chunks.push(chunk);
        });
        pdfDoc.end();
        pdfDoc.on("end", () => {
          const result = Buffer.concat(chunks);
          response.contentType("application/pdf");
          response.send(result);
        });
      } catch (error) {
        return response.handleError("Internal server error", 500);
      }
    });
  }
};

// src/controllers/states/index.ts
var StatesController = class {
  list(request2, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database("states").select("*");
        let selectStates = result.map((item) => {
          return {
            id: item.state_id,
            value: item.abbreviation,
            label: item.name
          };
        });
        selectStates.unshift({ id: "", value: "", label: "" });
        return response.json(selectStates);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal error server", 500);
      }
    });
  }
  create(request2, response) {
    return __async(this, null, function* () {
      const { name, abbreviation, state_id, fk_country_id } = request2.body;
      try {
        const result = yield database("states").insert({
          state_id,
          name,
          abbreviation,
          fk_country_id
        });
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.status(500).json({ error });
      }
    });
  }
};

// src/controllers/cities/index.ts
var CitiesController = class {
  list(request2, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database("cities").select("*");
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal error server", 500);
      }
    });
  }
  listByStateId(request2, response) {
    return __async(this, null, function* () {
      try {
        const { id } = request2.params;
        const result = yield database("cities").select("*").where({
          fk_state_id: id
        });
        let selectCities = result.map((item) => {
          return {
            id: item.city_id,
            value: item.city_id,
            label: item.name
          };
        });
        selectCities.unshift({ id: "", value: "", label: "" });
        return response.json(selectCities);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal error server", 500);
      }
    });
  }
  create(request2, response) {
    return __async(this, null, function* () {
      try {
        const { city_id, name, fk_state_id } = request2.body;
        const result = yield database("cities").insert({
          city_id,
          name,
          fk_state_id
        });
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.handleError("error", 500);
      }
    });
  }
};

// src/controllers/type/index.ts
var TypeController = class {
  list(request2, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database("type").select("*");
        let selectTypes = result.map((item) => {
          return {
            id: item.type_id,
            value: item.type_id,
            label: item.name
          };
        });
        selectTypes.unshift({ id: "", value: "", label: "" });
        return response.json(selectTypes);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal error server", 500);
      }
    });
  }
  create(request2, response) {
    return __async(this, null, function* () {
      try {
        const { name } = request2.body;
        try {
          const [typeExists] = yield database("type").select("*").where({
            name
          });
          if (typeExists) {
            return response.handleError("Type already exists", 400);
          }
        } catch (error) {
          return response.handleError("error", 500);
          console.log(error);
        }
        const result = yield database("type").insert({
          name
        });
        return response.json({ result });
      } catch (error) {
        console.log(error);
        return response.handleError("Internal server error", 500);
      }
    });
  }
};

// src/controllers/suppliers/index.ts
var yup2 = __toESM(require("yup"));
var import_fs = __toESM(require("fs"));
var import_azure_storage = __toESM(require("azure-storage"));
var SuppliersController = class {
  create(request2, response) {
    return __async(this, null, function* () {
      let values = request2.body;
      for (let key in values) {
        if (values[key] === "null") {
          values[key] = null;
        }
      }
      const schema = yup2.object().shape({
        fk_type_id: yup2.number().required("The type field must be filled"),
        register: yup2.string().required("The Registration field must be filled"),
        name: yup2.string().required("The Name field must be filled")
      });
      try {
        yield schema.validate(values, { abortEarly: false });
      } catch (error) {
        const allErrors = error.inner.reduce(
          (errors, currentValidation) => Object.assign(errors, {
            [currentValidation.path]: currentValidation.errors[0]
            //first error is enough for this demo
          }),
          {}
        );
        return response.status(400).json(allErrors);
      }
      try {
        const [supplierExists] = yield database.select("*").from("suppliers").where({ register: values.register });
        if (supplierExists) {
          return response.status(400).json({ message: "Supplier already exists" });
        }
      } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal server error" });
      }
      let photo_url = null;
      if (request2.file) {
        const photo = import_fs.default.readFileSync(request2.file.path);
        let filename = request2.file.filename;
        try {
          const blobService = import_azure_storage.default.createBlobService(
            process.env.AZURE_STORAGE_CONNECTION_STRING
          );
          blobService.deleteBlobIfExists(
            "suppliers",
            "https://globalmax.blob.core.windows.net/suppliers/102c957a6dac23ef27a176d9aa1d12e7-278990923_821581009247672_8635737171494939845_n.jpeg",
            (error) => {
              if (error) {
                response.send({ Grrr: error });
              }
            }
          );
          blobService.createBlockBlobFromText(
            "suppliers",
            filename,
            photo,
            (error) => {
              if (error) {
                response.send({ Grrr: error });
              }
            }
          );
        } catch (error) {
          console.log(error);
          return response.status(500).json({ error, msg: "erro ao salvar imagem no azure" });
        }
        photo_url = `https://globalmax.blob.core.windows.net/suppliers/${filename}`;
      }
      try {
        const [result] = yield database("suppliers").insert({
          fk_type_id: values.fk_type_id,
          register: values.register,
          name: values.name,
          fantasy_name: values.fantasy_name,
          fk_country_id: values.fk_country_id,
          fk_state_id: values.fk_state_id,
          fk_city_id: values.fk_city_id,
          street: values.street,
          neighborhood: values.neighborhood,
          number: values.number,
          zip_code: values.zip_code,
          phone: values.phone,
          cell: values.cell,
          state_registration: values.state_registration,
          logo_url: photo_url
        }).returning("*");
        return response.status(200).json({ result, message: "supplier registered successfully" });
      } catch (error) {
        return response.status(500).json({ error, message: "Pohaaa deu ruim" });
      }
    });
  }
  update(request2, response) {
    return __async(this, null, function* () {
      const { supplier_id } = request2.params;
      let supplierExists;
      let values = request2.body;
      for (let key in values) {
        if (values[key] === "null") {
          values[key] = null;
        }
      }
      const schema = yup2.object().shape({
        fk_type_id: yup2.number().required("The type field must be filled"),
        register: yup2.string().required("The Registration field must be filled"),
        name: yup2.string().required("The Name field must be filled")
      });
      try {
        yield schema.validate(request2.body, { abortEarly: false });
      } catch (error) {
        const allErrors = error.inner.reduce(
          (errors, currentValidation) => Object.assign(errors, {
            [currentValidation.path]: currentValidation.errors[0]
          }),
          {}
        );
        return response.status(400).json(allErrors);
      }
      try {
        [supplierExists] = yield database.select("*").from("suppliers").where({ supplier_id });
        if (!supplierExists) {
          return response.status(400).json({ keee: supplierExists, message: "Supplier does not exists" });
        }
        const [registerExists] = yield database.select("*").from("suppliers").where({ register: request2.body.register }).whereNot({ supplier_id });
        if (registerExists) {
          return response.status(400).json({ message: "Registeris already registered" });
        }
      } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal server error" });
      }
      let photo_url = supplierExists.photo_url;
      if (request2.file) {
        const photo = import_fs.default.readFileSync(request2.file.path);
        let filename = request2.file.filename;
        try {
          const blobService = import_azure_storage.default.createBlobService(
            process.env.AZURE_STORAGE_CONNECTION_STRING
          );
          if (supplierExists.logo_url !== null) {
            let po = supplierExists.logo_url;
            po = po.replace(
              "https://globalmax.blob.core.windows.net/suppliers/",
              ""
            );
            if (po !== filename) {
              blobService.deleteBlobIfExists("suppliers", po, (error) => {
                if (error) {
                  response.send({ Grrr: error });
                }
              });
            }
          }
          blobService.createBlockBlobFromText(
            "suppliers",
            filename,
            photo,
            (error) => {
              if (error) {
                response.send({ Grrr: error });
              }
            }
          );
        } catch (error) {
          console.log(error);
          return response.status(500).json({ error, msg: "erro ao salvar imagem no azure" });
        }
        photo_url = `https://globalmax.blob.core.windows.net/suppliers/${filename}`;
      }
      try {
        const [result] = yield database("suppliers").where({ supplier_id }).update({
          fk_type_id: values.fk_type_id,
          register: values.register,
          name: values.name,
          fantasy_name: values.fantasy_name,
          fk_country_id: values.fk_country_id,
          fk_state_id: values.fk_state_id,
          fk_city_id: values.fk_city_id,
          street: values.street,
          neighborhood: values.neighborhood,
          number: values.number,
          zip_code: values.zip_code,
          phone: values.phone,
          cell: values.cell,
          state_registration: values.state_registration,
          logo_url: photo_url
        }).returning("*");
        return response.status(200).json({ result, message: "supplier registered successfully" });
      } catch (error) {
        return response.status(500).json({ message: "Internal server error" });
      }
    });
  }
  list(request2, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database.select("suppliers.*", "c.name as city", "s.abbreviation as state").orderBy("supplier_id", "asc").from("suppliers").where({ active_supplier: true }).leftJoin("cities as c", "fk_city_id", "c.city_id").leftJoin("states as s", "suppliers.fk_state_id", "s.state_id");
        return response.json(result);
      } catch (error) {
        return response.handleError("Internal server error", 500);
      }
    });
  }
  get(request2, response) {
    return __async(this, null, function* () {
      try {
        const { supplier_id } = request2.params;
        const result = yield database.select(
          "suppliers.*",
          "city.name as city",
          "state.abbreviation as state",
          "country.name as country",
          "t.name as type"
        ).orderBy("supplier_id", "asc").from("suppliers").where({ active_supplier: true, supplier_id }).leftJoin("cities as city", "fk_city_id", "city.city_id").leftJoin("countries as country", "fk_country_id", "country.country_id").leftJoin("states as state", "suppliers.fk_state_id", "state.state_id").leftJoin("type as t", "fk_type_id", "t.type_id");
        return response.json(result);
      } catch (error) {
        return response.status(500).json({ message: "Internal server erroree" });
      }
    });
  }
  delete(request2, response) {
    return __async(this, null, function* () {
      const { supplier_id } = request2.params;
      const schema = yup2.object().shape({
        supplier_id: yup2.number().integer()
      });
      try {
        yield schema.validate(request2.params);
      } catch (error) {
        return response.status(400).json({ validate: false, message: error.errors });
      }
      try {
        const [supplierExists] = yield database.select("*").from("suppliers").where({ supplier_id });
        if (!supplierExists) {
          return response.status(400).json({
            message: "Supplier not exists"
          });
        }
        if (supplierExists.active_supplier === false) {
          return response.status(202).json({
            message: "provider has already been deleted"
          });
        }
      } catch (error) {
        console.log(error);
        return response.status(400).json({ validate: false, message: "Internal error server" });
      }
      try {
        const [result] = yield database("suppliers").update({ active_supplier: false }).where({ supplier_id }).returning("*");
        return response.status(200).json({ result });
      } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal error server" });
      }
    });
  }
};

// src/controllers/companies/index.ts
var CompaniesController = class {
  create(request2, response) {
    return __async(this, null, function* () {
      let {
        fk_type_id,
        register,
        name,
        fantasy_name,
        fk_country_id,
        fk_state_id,
        fk_city_id,
        street,
        neighborhood,
        number: number3,
        zip_code,
        phone,
        cell,
        state_registration,
        logo_url
      } = request2.body;
      try {
        const [companiesExists] = yield database.select("*").from("companies").where({ register });
        if (companiesExists) {
          return response.handleError("Company already exists", 400);
        }
        const result = yield database("companies").insert({
          fk_type_id,
          register,
          name,
          fantasy_name,
          fk_country_id,
          fk_state_id,
          fk_city_id,
          street,
          neighborhood,
          number: number3,
          zip_code,
          phone,
          cell,
          state_registration,
          logo_url
        });
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal server error", 500);
      }
    });
  }
  list(request2, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database.select("companies.*", "c.name as city", "s.abbreviation as state").orderBy("company_id", "asc").from("companies").innerJoin("cities as c", "fk_city_id", "c.city_id").innerJoin("states as s", "companies.fk_state_id", "s.state_id");
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal server error", 500);
      }
    });
  }
};

// src/controllers/status/index.ts
var StatusController = class {
  list(request2, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database("status").select("*");
        let selectStatus = result.map((item) => {
          return {
            id: item.status_id,
            value: item.status_id,
            label: item.name
          };
        });
        selectStatus.unshift({ id: "", value: "", label: "" });
        return response.json(selectStatus);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal error server", 500);
      }
    });
  }
  create(request2, response) {
    return __async(this, null, function* () {
      try {
        const { name } = request2.body;
        try {
          const [typeExists] = yield database("status").select("*").where({
            name
          });
          if (typeExists) {
            return response.handleError("Status already exists", 400);
          }
        } catch (error) {
          return response.handleError("error", 500);
          console.log(error);
        }
        const result = yield database("status").insert({
          name
        });
        return response.json({ result });
      } catch (error) {
        console.log(error);
        return response.handleError("Internal server error", 500);
      }
    });
  }
};

// src/controllers/currency/index.ts
var CurrencyController = class {
  list(request2, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database("currency").select("*");
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal error server", 500);
      }
    });
  }
  get(request2, response) {
    return __async(this, null, function* () {
      const { currency_id } = request2.params;
      try {
        const [result] = yield database("currency").select("*").where({ currency_id: parseInt(currency_id) });
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal error server", 500);
      }
    });
  }
  create(request2, response) {
    return __async(this, null, function* () {
      try {
        const { name } = request2.body;
        try {
          const [typeExists] = yield database("currency").select("*").where({
            name
          });
          if (typeExists) {
            return response.handleError("Currency already exists", 400);
          }
        } catch (error) {
          console.log(error);
          return response.status(500).json({ message: "Internal error server" });
        }
        const result = yield database("currency").insert({
          name
        });
        return response.json({ result });
      } catch (error) {
        console.log(error);
        return response.handleError("Internal server error", 500);
      }
    });
  }
};

// src/controllers/nature/index.ts
var NatureController = class {
  list(request2, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database("nature").select("*");
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal error server", 500);
      }
    });
  }
  create(request2, response) {
    return __async(this, null, function* () {
      try {
        const { name } = request2.body;
        try {
          const [typeExists] = yield database("nature").select("*").where({
            name
          });
          if (typeExists) {
            return response.handleError("Nature already exists", 400);
          }
        } catch (error) {
          console.log(error);
          return response.status(500).json({ message: "Internal error server" });
        }
        const result = yield database("nature").insert({
          name
        });
        return response.json({ result });
      } catch (error) {
        console.log(error);
        return response.handleError("Internal server error", 500);
      }
    });
  }
};

// src/controllers/costCenter/index.ts
var CostCenterController = class {
  list(request2, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database("cost_center").select("*");
        return response.json(result);
      } catch (error) {
        console.log(error);
        return response.handleError("Internal error server", 500);
      }
    });
  }
  create(request2, response) {
    return __async(this, null, function* () {
      try {
        const { name } = request2.body;
        try {
          const [typeExists] = yield database("cost_center").select("*").where({
            name
          });
          if (typeExists) {
            return response.handleError("Cost center already exists", 400);
          }
        } catch (error) {
          console.log(error);
          return response.status(500).json({ message: "Internal error server" });
        }
        const result = yield database("cost_center").insert({
          name
        });
        return response.json({ result });
      } catch (error) {
        console.log(error);
        return response.handleError("Internal server error", 500);
      }
    });
  }
};

// src/routes.ts
var router = (0, import_express.Router)();
var userController = new UserController();
var countriesController = new CountriesController();
var receiptsController = new ReceiptsController();
var statesController = new StatesController();
var citiesController = new CitiesController();
var typeController = new TypeController();
var suppliersController = new SuppliersController();
var companiesController = new CompaniesController();
var statusController = new StatusController();
var currencyController = new CurrencyController();
var natureController = new NatureController();
var costCenterController = new CostCenterController();
router.post("/user/create/", userController.create);
router.post("/user/authenticate/", userController.authenticate);
router.get("/countries", countriesController.list);
router.post("/countries/create", countriesController.create);
router.get("/cities", citiesController.list);
router.get("/cities/:id", citiesController.listByStateId);
router.post("/cities/create", citiesController.create);
router.get("/states", statesController.list);
router.post("/states/create", statesController.create);
router.get("/type", typeController.list);
router.post("/type/create", typeController.create);
router.get("/suppliers", suppliersController.list);
router.get("/suppliers/:supplier_id", suppliersController.get);
router.delete("/suppliers/delete/:supplier_id", suppliersController.delete);
router.post("/suppliers/create", (0, import_multer2.default)(multerConfig).single("file"), suppliersController.create);
router.put("/suppliers/update/:supplier_id", (0, import_multer2.default)(multerConfig).single("file"), suppliersController.update);
router.get("/companies", companiesController.list);
router.post("/companies/create", companiesController.create);
router.get("/status", statusController.list);
router.post("/status/create", statusController.create);
router.get("/receipts/", receiptsController.list);
router.get("/receipts/:id", receiptsController.get);
router.get("/receipts/view/:receipt_id", receiptsController.view);
router.post("/receipts/create/", receiptsController.create);
router.put("/receipts/update/:receipt_id", receiptsController.update);
router.delete("/receipts/delete/:receipt_id", receiptsController.delete);
router.get("/currency", currencyController.list);
router.get("/currency/:currency_id", currencyController.get);
router.get("/nature", natureController.list);
router.get("/cost_center", costCenterController.list);

// src/server.ts
var app = (0, import_express2.default)();
app.use((0, import_cors.default)());
app.use(import_express2.default.json());
app.use(handleError);
app.use((0, import_morgan.default)("dev"));
app.use(router);
var port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Server is running on port ${port}`));
