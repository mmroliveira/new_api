import { Request, Response } from "express";
import { database } from "../../database/connection";

import { states } from "../../resources/states";

interface IStatus {
  status_id?: number;
  name: string;
}

export class StatusController {
  async list(request: Request, response: Response) {
    try {
      const result = await database("status").select("*");

      let selectStatus = result.map((item) => {
        return {
          id: item.status_id,
          value: item.status_id,
          label: item.name,
        };
      });

      selectStatus.unshift({ id: "", value: "", label: "" });

      return response.json(selectStatus);
    } catch (error) {
      console.log(error);
      return response.handleError("Internal error server", 500);
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { name } = request.body;

      // Verificando se o tipo de status existe
      try {
        const [typeExists] = await database("status").select("*").where({
          name: name,
        });

        if (typeExists) {
          return response.handleError("Status already exists", 400);
        }
      } catch (error) {
        return response.handleError("error", 500);
        console.log(error);
      }

      // fazendo a inclusão no banco de dados
      const result = await database("status").insert({
        name: name,
      });

      return response.json({ result });
    } catch (error) {
      console.log(error);
      return response.handleError("Internal server error", 500);
    }
  }
}
