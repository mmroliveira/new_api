import { Request, Response } from "express";
import { database } from "../../database/connection";

import { states } from "../../resources/states";

interface IType {
  type_id?: number;
  name: string;
}

export class TypeController {
  async list(request: Request, response: Response) {
    try {
      const result = await database("type").select("*");

      let selectTypes = result.map((item) => {
        return {
          id: item.type_id,
          value: item.type_id,
          label: item.name,
        };
      });

      selectTypes.unshift({ id: "", value: "", label: "" });

      return response.json(selectTypes);
    } catch (error) {
      console.log(error);
      return response.handleError("Internal error server", 500);
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { name } = request.body;

      // Verificando se o tipo de fornecedor/cliente existe
      try {
        const [typeExists] = await database("type").select("*").where({
          name: name,
        });

        if (typeExists) {
          return response.handleError("Type already exists", 400);
        }
      } catch (error) {
        return response.handleError("error", 500);
        console.log(error);
      }

      // fazendo a inclusão no banco de dados
      const result = await database("type").insert({
        name: name,
      });

      return response.json({ result });
    } catch (error) {
      console.log(error);
      return response.handleError("Internal server error", 500);
    }
  }
}
