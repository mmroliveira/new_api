import { Request, Response } from "express";
import { database } from "../../database/connection";

import { states } from "../../resources/states";

export interface IState {
  state_id?: number;
  name: string;
  abbreviation: string;
  fk_country_id: number;
}

export class StatesController {
  async list(request: Request, response: Response) {
    try {
      const result = await database("states").select("*");

      let selectStates = result.map((item) => {
        return {
          id: item.state_id,
          value: item.abbreviation,
          label: item.name,
        };
      });

      selectStates.unshift({ id: "", value: "", label: "" });

      return response.json(selectStates);
    } catch (error) {
      console.log(error);
      return response.handleError("Internal error server", 500);
    }
  }

  async create(request: Request, response: Response) {
    // try {
    //   states.map(async (item) => {
    //     await database("states").insert({
    //       name: item.name,
    //       abbreviation: item.abbreviation,
    //       state_id: item.state_id,
    //       fk_country_id: item.country,
    //     });
    //   });

    const { name, abbreviation, state_id, fk_country_id } = request.body;

    try {
      const result = await database("states").insert({
        state_id: state_id,
        name: name,
        abbreviation: abbreviation,
        fk_country_id: fk_country_id,
      });

      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: error });
    }
  }
}
