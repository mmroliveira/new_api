import { Request, Response } from "express";
import { database } from "../../database/connection";

export class NatureController {
  async list(request: Request, response: Response) {
    try {
      const result = await database("nature").select("*");

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
        const [typeExists] = await database("nature").select("*").where({
          name: name,
        });

        if (typeExists) {
          return response.handleError("Nature already exists", 400);
        }
      } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal error server" });
      }

      // fazendo a inclusão no banco de dados
      const result = await database("nature").insert({
        name: name,
      });

      return response.json({ result });
    } catch (error) {
      console.log(error);
      return response.handleError("Internal server error", 500);
    }
  }
}
