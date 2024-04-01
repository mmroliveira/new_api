import { Request, Response } from "express";
import { database } from "../../database/connection";

import { states } from "../../resources/states";

interface ICountries {
  country_id?: number;
  name: string;
  abbreviation: string;
}

export class CountriesController {
  async create(request: Request, response: Response) {
    try {
      const { name, abbreviation } = request.body;

      // verificando se o país já existe
      const [countryExists] = await database
        .select("*")
        .from<ICountries>("countries")
        .where({
          abbreviation: abbreviation,
        });

      if (countryExists) {
        return response.handleError("Country already exists", 400);
      }

      // fazendo a inclusão
      const [result] = await database("countries")
        .insert({
          name: name,
          abbreviation: abbreviation,
        })
        .returning("*");

      return response.json({ result });
    } catch (error) {
      return response.handleError("Internal server error", 500);
    }
  }

  async list(request: Request, response: Response) {
    try {
      const result = await database("countries").select("*");

      let selectCountry = result.map((item) => {
        return {
          id: item.country_id,
          value: item.country_id,
          label: item.name,
        };
      });

      selectCountry.unshift({ id: "", value: "", label: "" });

      return response.json(selectCountry);
    } catch (error) {
      return response.handleError("Internal server error", 500);
    }
  }
}
