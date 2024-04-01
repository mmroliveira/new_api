import extenso from "extenso";
import { TDocumentDefinitions } from "pdfmake";

import { translate } from "free-translate";

import { ICompanies } from "@/controllers/companies";
import { ISuppliers } from "@/controllers/suppliers";
import { IReceipts } from "@/controllers/receipts";
import { currency } from "../utils";
import { ICurrency } from "@/controllers/currency";

export class GenerateReceipts {
  getFonts() {
    const fonts = {
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    };

    return fonts;
  }

  async generate(
    company: ICompanies,
    payer: ISuppliers,
    receiver: ISuppliers,
    receipt: IReceipts,
    city: string,
    state: string,
    currency: ICurrency
  ) {
    function getHeader() {
      const header = {
        margin: 10,
        columns: [
          {
            table: {
              widths: ["50%", "50%"],
              headerRows: 1,

              body: [
                [
                  {
                    image:
                      receipt.fk_company_id === 1
                        ? "./src/resources/receipts/assets/globalmax.png"
                        : receipt.fk_company_id === 2
                        ? "./src/resources/receipts/assets/laca.png"
                        : "./src/resources/receipts/assets/preformax.png",
                    width: 200,
                    height: 80,
                  },

                  {
                    ol: [
                      {
                        text: `${company.name}`,
                        style: "text",
                        listType: "none",
                      },
                      {
                        text: `Rua ${company.street}, Nº ${company.number} – ${company.neighborhood}`,
                        style: "text",
                        listType: "none",
                      },
                      {
                        text: `${city} / ${state} ${
                          company.zip_code !== null
                            ? `– CEP: ${company.zip_code}`
                            : ""
                        }`,
                        style: "text",
                        listType: "none",
                      },
                      {
                        text: `Telefone: ${company.phone}`,
                        listType: "none",
                        style: "text",
                      },
                      {
                        text: `${
                          receipt.fk_company_id === 3
                            ? `RUC ${company.register}`
                            : `CNPJ ${company.register}`
                        }`,
                        listType: "none",
                        style: "text",
                      },
                      {
                        text: `${
                          company.state_registration !== null
                            ? `Insc. Est. ${company.state_registration}`
                            : ""
                        }`,
                        listType: "none",
                        style: "text",
                      },
                    ],

                    alignment: "right",
                  },
                ],
              ],
            },
            layout: "noBorders",
          },
        ],
      };

      return header;
    }

    function getContentId() {
      const contentId = [
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
                          text: `\nRecibo: ${receipt.receipt_id}`,
                          listType: "none",
                          style: "title",
                        },
                        {
                          text: `\n\nValor: ${currency.abbreviation} ${receipt.amount}`,
                          listType: "none",
                          style: "title",
                        },
                      ],
                    },
                    {
                      qr: `${process.env.BASE_URL}/receipts/${receipt.receipt_id}`,
                    },
                  ],
                ],
              },
              layout: "noBorders",
            },
          ],
        },
      ];
      return contentId;
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
                      style: "tableText",
                    },
                  ],
                  [
                    { text: "Referente", style: "tableTitle" },
                    {
                      text: `${receipt.regarding}`,
                      style: "tableText",
                    },
                  ],
                  [
                    { text: "A importância de", style: "tableTitle" },
                    {
                      text: `${currency.abbreviation} ${receipt.amount} (${valueText})`,
                      style: "tableText",
                    },
                  ],
                  [
                    { text: "Colaborador", style: "tableTitle" },
                    {
                      text: `${receiver.name}`,
                      style: "tableText",
                    },
                  ],
                ],
              },
            },
            { width: "10%", text: "" },
          ],
        },
      ];

      return description;
    }

    function getContentSignature() {
      const contentSignature = [
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
                  [{ text: `\n${receiver.name}` }],
                  [
                    {
                      text: `${receiver.register}`,
                    },
                  ],
                ],
              },
              layout: "noBorders",
            },
            { width: "10%", text: "" },
          ],
        },
      ];
      return contentSignature;
    }

    function getContentLocalization() {
      const contentLocalization = [
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
                      text: `${city} - ${state}`,
                    },
                  ],
                  [
                    {
                      text: `${receipt.date}`,
                    },
                  ],
                ],
              },
              layout: "noBorders",
            },
            { width: "10%", text: "" },
          ],
        },
      ];
      return contentLocalization;
    }

    function convertCurrencies(value) {
      if (currency.currency_id === 2) {
        value = value.replace("real", "dólar");
        value = value.replace("reais", "dólares");
        value = value.replace("centavo", "cent");
        value = value.replace("centavos", "cents");
        return value;
      } else if (currency.currency_id === 3) {
        value = value.replace("real", "guaraní");
        value = value.replace("reais", "guaraníes");
        return value;
      } else {
        return value;
      }
    }

    let value = extenso(receipt.amount, {
      mode: "currency",
    });

    value = convertCurrencies(value);

    const header = getHeader();
    const contentId = getContentId();
    const contentDescription = getContentDescription(value);
    const contentSignature = getContentSignature();
    const contentLocalization = getContentLocalization();

    const docDefinitions: TDocumentDefinitions = {
      defaultStyle: { font: "Helvetica" },
      pageSize: "LEGAL",
      pageMargins: [40, 100, 40, 60],

      header: header,
      content: [
        contentId,
        contentDescription,
        contentSignature,
        contentLocalization,
      ],
      styles: {
        text: {
          fontSize: 10,
          margin: [0, 0, 0, 4],
        },
        contentId: {
          margin: [0, 100, 0, 0],
        },
        tableContent: {
          margin: [0, 80, 0, 0],
        },
        tableTitle: {
          margin: [2, 2, 2, 2],
          alignment: "center",
          bold: true,
        },
        tableText: {
          alignment: "left",
          margin: [2, 2, 2, 2],
        },
        signatureContent: {
          margin: [0, 150, 0, 0],
        },
        localizationContent: {
          margin: [0, 150, 0, 0],
        },
        title: {
          fontSize: 18,
          bold: true,
        },
      },
    };

    return docDefinitions;
  }
}
