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

// src/resources/receipts/index.ts
var receipts_exports = {};
__export(receipts_exports, {
  GenerateReceipts: () => GenerateReceipts
});
module.exports = __toCommonJS(receipts_exports);
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
  async generate(company, payer, receiver, receipt, city, state, currency) {
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
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GenerateReceipts
});
