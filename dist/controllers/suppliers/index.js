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

// src/controllers/suppliers/index.ts
var suppliers_exports = {};
__export(suppliers_exports, {
  SuppliersController: () => SuppliersController
});
module.exports = __toCommonJS(suppliers_exports);

// src/database/connection.ts
var import_knex = __toESM(require("knex"));
var import_knexfile = __toESM(require_knexfile());
var environment = process.env.DB_ENV || "development";
var database = (0, import_knex.default)(import_knexfile.default[environment]);

// src/controllers/suppliers/index.ts
var yup = __toESM(require("yup"));
var import_fs = __toESM(require("fs"));
var import_azure_storage = __toESM(require("azure-storage"));
var SuppliersController = class {
  create(request, response) {
    return __async(this, null, function* () {
      let values = request.body;
      for (let key in values) {
        if (values[key] === "null") {
          values[key] = null;
        }
      }
      const schema = yup.object().shape({
        fk_type_id: yup.number().required("The type field must be filled"),
        register: yup.string().required("The Registration field must be filled"),
        name: yup.string().required("The Name field must be filled")
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
      if (request.file) {
        const photo = import_fs.default.readFileSync(request.file.path);
        let filename = request.file.filename;
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
  update(request, response) {
    return __async(this, null, function* () {
      const { supplier_id } = request.params;
      let supplierExists;
      let values = request.body;
      for (let key in values) {
        if (values[key] === "null") {
          values[key] = null;
        }
      }
      const schema = yup.object().shape({
        fk_type_id: yup.number().required("The type field must be filled"),
        register: yup.string().required("The Registration field must be filled"),
        name: yup.string().required("The Name field must be filled")
      });
      try {
        yield schema.validate(request.body, { abortEarly: false });
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
        const [registerExists] = yield database.select("*").from("suppliers").where({ register: request.body.register }).whereNot({ supplier_id });
        if (registerExists) {
          return response.status(400).json({ message: "Registeris already registered" });
        }
      } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal server error" });
      }
      let photo_url = supplierExists.photo_url;
      if (request.file) {
        const photo = import_fs.default.readFileSync(request.file.path);
        let filename = request.file.filename;
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
  list(request, response) {
    return __async(this, null, function* () {
      try {
        const result = yield database.select("suppliers.*", "c.name as city", "s.abbreviation as state").orderBy("supplier_id", "asc").from("suppliers").where({ active_supplier: true }).leftJoin("cities as c", "fk_city_id", "c.city_id").leftJoin("states as s", "suppliers.fk_state_id", "s.state_id");
        return response.json(result);
      } catch (error) {
        return response.handleError("Internal server error", 500);
      }
    });
  }
  get(request, response) {
    return __async(this, null, function* () {
      try {
        const { supplier_id } = request.params;
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
  delete(request, response) {
    return __async(this, null, function* () {
      const { supplier_id } = request.params;
      const schema = yup.object().shape({
        supplier_id: yup.number().integer()
      });
      try {
        yield schema.validate(request.params);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SuppliersController
});
