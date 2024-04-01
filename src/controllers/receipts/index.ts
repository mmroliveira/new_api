import { Request, Response } from "express";
import { database } from "../../database/connection";

import moment from "moment";

import { ICompanies } from "../../controllers/companies";
import { GenerateReceipts } from "../../resources/receipts";
import { ISuppliers } from "../../controllers/suppliers";

import * as yup from "yup";

import PDFPrinter from "pdfmake";

export interface IReceipts {
  receipt_id: number;
  amount: string;
  regarding: string;
  fk_company_id: number;
  payer: number;
  receiver: number;
  date: Date;
  fk_status_id: number;
  currency: number;
}

export class ReceiptsController {
  async create(request: Request, response: Response) {
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
        fk_cost_center_id,
      } = request.body;

      const fk_status_id = 1;

      // buscando a empresa
      const [company] = await database
        .select("*")
        .from<ICompanies>("companies")
        .where({
          company_id: fk_company_id,
        });

      if (company === null) {
        return response.status(400).json({ message: "Company does not exist" });
      }

      // buscando os dados do pagador
      const [payerExists] = await database
        .select("*")
        .from<ISuppliers>("suppliers")
        .where({
          supplier_id: payer,
        });

      if (payerExists === null) {
        return response.status(400).json({ message: "Payer does not exist" });
      }

      // buscando os dados do recebedor
      const [receiverExists] = await database
        .select("*")
        .from<ISuppliers>("suppliers")
        .where({
          supplier_id: receiver,
        });

      if (receiverExists === null) {
        return response
          .status(400)
          .json({ message: "Receiver does not exist" });
      }

      // gravando o recibo no banco de dados
      const receipt = await database("receipts").insert({
        amount: amount,
        regarding: regarding,
        fk_status_id: fk_status_id,
        fk_company_id: company.company_id,
        payer: payerExists.supplier_id,
        receiver: receiverExists.supplier_id,
        date: moment(date).format("DD/MM/YYYY"),
        created_by: created_by,
        currency: currency,
        fk_nature_id: fk_nature_id,
        fk_cost_center_id: fk_cost_center_id,
      });

      return response
        .status(200)
        .json({ message: "Receipt registered successfully" });
    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: error });
    }
  }

  async update(request: Request, response: Response) {
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
      } = request.body;
      console.log('cu', currency);
      const { receipt_id } = request.params;

      const fk_status_id = 1;

      // buscando a empresa
      const [company] = await database
        .select("*")
        .from<ICompanies>("companies")
        .where({
          company_id: fk_company_id,
        });

      if (company === null) {
        return response.status(400).json({ message: "Company does not exist" });
      }

      // buscando os dados do pagador
      const [payerExists] = await database
        .select("*")
        .from<ISuppliers>("suppliers")
        .where({
          supplier_id: payer,
        });

      if (payerExists === null) {
        return response.status(400).json({ message: "Payer does not exist" });
      }

      // buscando os dados do recebedor
      const [receiverExists] = await database
        .select("*")
        .from<ISuppliers>("suppliers")
        .where({
          supplier_id: receiver,
        });

      if (receiverExists === null) {
        return response
          .status(400)
          .json({ message: "Receiver does not exist" });
      }

      // gravando o recibo no banco de dados
      const receipt = await database
        .where({ receipt_id: receipt_id })
        .update({
          amount: amount,
          regarding: regarding,
          fk_status_id: fk_status_id,
          fk_company_id: company.company_id,
          payer: payerExists.supplier_id,
          receiver: receiverExists.supplier_id,
          date: moment(date).format("DD/MM/YYYY"),
          created_by: created_by,
          currency: currency,
        })
        .table("receipts");

      return response
        .status(200)
        .json({ message: "Receipt updated successfully" });
    } catch (error) {
      console.log(error);
      return response.status(400).json({ message: error });
    }
  }

  async list(request: Request, response: Response) {
    try {
      const result = await database
        .select([
          "receipts.receipt_id as id",
          "fk_company_id",
          "amount",
          "regarding",
          "receipts.date",
          "payer.name as payer",
          "receiver.name as receiver",
          "currency.abbreviation",
        ])
        .orderBy("id", "asc")
        .table("receipts")
        .innerJoin("suppliers as payer", "payer", "payer.supplier_id")
        .where("active_receipt", true)
        .leftJoin("suppliers as receiver", "receiver", "receiver.supplier_id")
        .leftJoin("currency as currency", "currency", "currency.currency_id")
        .where("active_receipt", true);

      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.handleError("Internal server error", 500);
    }
  }

  async view(request: Request, response: Response) {
    const { receipt_id } = request.params;

    try {
      const result = await database
        .select([
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
        ])
        .table("receipts")
        .where("receipt_id", receipt_id)
        .join("suppliers as payer", "payer", "payer.supplier_id")
        .join("suppliers as receiver", "receiver", "receiver.supplier_id")
        .join("companies as company", "fk_company_id", "company.company_id")
        .join("countries as country","company.fk_country_id","country.country_id")
        .join("states as state", "company.fk_state_id", "state.state_id")
        .join("cities as city", "company.fk_city_id", "city.city_id")
        .join("nature", "fk_nature_id", "nature.nature_id" )
        .join("cost_center", "fk_cost_center_id", "cost_center.cost_center_id")
        .join("currency as currency", "currency", "currency.currency_id");

      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.handleError("Internal server error", 500);
    }
  }

  async delete(request: Request, response: Response) {
    // pegando o id da requisição
    const { receipt_id } = request.params;

    // definição da validação
    const schema = yup.object().shape({
      receipt_id: yup.number().integer(),
    });

    // tentando fazer a verificação
    try {
      await schema.validate({ receipt_id });
    } catch (error) {
      return response.status(400).json({
        validate: false,
        message: error.errors,
      });
    }

    // verificando se o recibo existe
    try {
      const [existReceipt] = await database("receipts")
        .select("*")
        .where({ receipt_id: receipt_id });

      if (!existReceipt) {
        return response.status(400).json({
          message: "Receipt not exists",
        });
      }

      if (existReceipt.active_receipt === false) {
        return response.status(202).json({
          message: "provider has already been deleted",
        });
      }
    } catch (error) {
      console.log(error);
      return response
        .status(400)
        .json({ validate: false, message: "Internal error server" });
    }

    // fazendo a exclusão
    try {
      const result = await database("receipts")
        .update({ active_receipt: 0 })
        .where({ receipt_id: receipt_id })
        .returning("*");

      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        message: "Internal error server",
      });
    }
  }

  async get(request: Request, response: Response) {
    try {
      const { id } = request.params;

      // buscando os dados do recibo
      const [receipt] = await database
        .select("*")
        .from<IReceipts>("receipts")
        .where({
          receipt_id: parseInt(id),
        });

      if (receipt === null) {
        return response.handleError("Receipt does not exist", 400);
      }

      // buscando os dados da empresa
      const [company] = await database
        .select("*")
        .from<ICompanies>("companies")
        .where({
          company_id: receipt.fk_company_id,
        });

      if (company === null) {
        return response.handleError("Bad request", 400);
      }

      // buscando o nome do estado da empresa
      const [state] = await database
        .select("abbreviation")
        .from("states")
        .where({
          state_id: company.fk_state_id,
        });

      if (state === null) {
        return response.handleError("Bad request", 400);
      }

      // buscando o nome da cidade da empresa
      const [city] = await database.select("name").from("cities").where({
        city_id: company.fk_city_id,
      });

      if (city === null) {
        return response.handleError("Bad request", 400);
      }

      // buscando os dados do pagador
      const [payer] = await database
        .select("*")
        .from<ISuppliers>("suppliers")
        .where({
          supplier_id: receipt.payer,
        });

      if (payer === null) {
        return response.handleError("Bad request", 400);
      }

      // buscando os dados do recebedor
      const [receiver] = await database
        .select("*")
        .from<ISuppliers>("suppliers")
        .where({
          supplier_id: receipt.receiver,
        });

      if (receiver === null) {
        return response.handleError("Bad request", 400);
      }

      // buscando os dados da moeda 
      const [currency] = await database
        .select("*")
        .from("currency")
        .where({
          currency_id: receipt.currency,
        });

      if (currency === null) {
        return response.handleError("Bad request", 400);
      }

      // com todos os dados ... gerando o recibo em pdf
      const generateReceipts = new GenerateReceipts();

      const fonts = generateReceipts.getFonts();
      const docDefinitions = await generateReceipts.generate(
        company,
        payer,
        receiver,
        receipt,
        city.name,
        state.abbreviation,
        currency,
      );

      const printer = new PDFPrinter(fonts);
      const pdfDoc = printer.createPdfKitDocument(docDefinitions);

      const chunks: any = [];

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
  }
}
