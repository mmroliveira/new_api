import { Request, Response } from "express";
import { database } from "../../database/connection";

export interface ICurrency {
  currency_id: number;
  name: string;
  abbreviation: string;
}

export class CurrencyController {
  async list(request: Request, response: Response) {
    try {
      const result = await database("currency").select("*");

      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.handleError("Internal error server", 500);
    }
  }

  async get(request: Request, response: Response) {
    const { currency_id } = request.params;
    try {
      const [result] = await database("currency")
        .select("*")
        .where({ currency_id: parseInt(currency_id) });

      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.handleError("Internal error server", 500);
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { name } = request.body;

      // Verificando se a moeda existe
      try {
        const [typeExists] = await database("currency").select("*").where({
          name: name,
        });

        if (typeExists) {
          return response.handleError("Currency already exists", 400);
        }
      } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal error server" });
      }

      // fazendo a inclusão no banco de dados
      const result = await database("currency").insert({
        name: name,
      });

      return response.json({ result });
    } catch (error) {
      console.log(error);
      return response.handleError("Internal server error", 500);
    }
  }
}
