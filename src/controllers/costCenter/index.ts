import { Request, Response } from "express";
import { database } from "../../database/connection";

export class CostCenterController {
  async list(request: Request, response: Response) {
    try {
      const result = await database("cost_center").select("*");

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
        const [typeExists] = await database("cost_center").select("*").where({
          name: name,
        });

        if (typeExists) {
          return response.handleError("Cost center already exists", 400);
        }
      } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal error server" });
      }

      // fazendo a inclusão no banco de dados
      const result = await database("cost_center").insert({
        name: name,
      });

      return response.json({ result });
    } catch (error) {
      console.log(error);
      return response.handleError("Internal server error", 500);
    }
  }
}
