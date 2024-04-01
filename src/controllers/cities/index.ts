import { Request, Response } from "express";
import { database } from "../../database/connection";

import { cities } from "../../resources/cities/";

export class CitiesController {
  async list(request: Request, response: Response) {
    try {
      const result = await database("cities").select("*");

      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.handleError("Internal error server", 500);
    }
  }

  async listByStateId(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const result = await database("cities").select("*").where({
        fk_state_id: id,
      });

      let selectCities = result.map((item) => {
        return {
          id: item.city_id,
          value: item.city_id,
          label: item.name,
        };
      });

      selectCities.unshift({ id: "", value: "", label: "" });

      return response.json(selectCities);
    } catch (error) {
      console.log(error);
      return response.handleError("Internal error server", 500);
    }
  }

  async create(request: Request, response: Response) {
    
    // try {
    //   cities.map(async (item) => {
    //     await database("cities").insert({
    //       city_id: item.id,
    //       name: item.name,
    //       fk_state_id: item.state_id,
    //     });
    //   });

    try {
      const { city_id, name, fk_state_id } = request.body;

      const result = await database("cities").insert({
        city_id: city_id,
        name: name,
        fk_state_id,
      });

      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.handleError("error", 500);
    }
  }
}
