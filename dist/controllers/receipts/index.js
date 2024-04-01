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

// src/controllers/receipts/index.ts
var receipts_exports = {};
__export(receipts_exports, {
  ReceiptsController: () => ReceiptsController
});
module.exports = __toCommonJS(receipts_exports);

// src/database/connection.ts
var import_knex = __toESM(require("knex"));
var import_knexfile = __toESM(require_knexfile());
var environment = process.env.DB_ENV || "development";
var database = (0, import_knex.default)(import_knexfile.default[environment]);

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
  create(request, response) {
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
        } = request.body;
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
  update(request, response) {
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
        } = request.body;
        console.log("cu", currency);
        const { receipt_id } = request.params;
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
  list(request, response) {
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
  view(request, response) {
    return __async(this, null, function* () {
      const { receipt_id } = request.params;
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
  delete(request, response) {
    return __async(this, null, function* () {
      const { receipt_id } = request.params;
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
  get(request, response) {
    return __async(this, null, function* () {
      try {
        const { id } = request.params;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ReceiptsController
});
