import { Request, Response } from "express";
import { database } from "../../database/connection";

import { IState } from "../../controllers/states";

export interface ICompanies {
  company_id?: number;
  fk_type_id: number;
  register: string;
  name: string;
  fantasy_name?: string;
  fk_country_id?: number;
  fk_state_id?: number;
  fk_city_id?: number;
  street?: string;
  neighborhood?: string;
  number?: string;
  zip_code?: string;
  phone?: string;
  cell?: string;
  state_registration?: string;
  logo_url?: string;
}

export class CompaniesController {
  async create(request: Request, response: Response) {
    let {
      fk_type_id,
      register,
      name,
      fantasy_name,
      fk_country_id,
      fk_state_id,
      fk_city_id,
      street,
      neighborhood,
      number,
      zip_code,
      phone,
      cell,
      state_registration,
      logo_url,
    } = request.body;

    // //validação do tipo
    // if (validator.isEmpty(fk_type_id)) {
    //   fk_type_id = null;
    // } else {
    //   fk_type_id = parseInt(fk_type_id);
    // }

    // // validação do país
    // if (validator.isEmpty(fk_country_id)) {
    //   fk_country_id = null;
    // } else {
    //   fk_country_id = parseInt(fk_country_id);
    // }

    // // validação do estado
    // if (validator.isEmpty(fk_state_id)) {
    //   fk_state_id = null;
    // } else {
    //   const [result] = await database
    //     .select("state_id")
    //     .from<IState>("states")
    //     .where({
    //       abbreviation: fk_state_id,
    //     });

    //   fk_state_id = result.state_id;
    // }

    try {
      const [companiesExists] = await database
        .select("*")
        .from<ICompanies>("companies")
        .where({ register: register });

      if (companiesExists) {
        return response.handleError("Company already exists", 400);
      }

      const result = await database("companies").insert({
        fk_type_id,
        register,
        name,
        fantasy_name,
        fk_country_id,
        fk_state_id,
        fk_city_id,
        street,
        neighborhood,
        number,
        zip_code,
        phone,
        cell,
        state_registration,
        logo_url,
      });

      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.handleError("Internal server error", 500);
    }
  }

  async list(request: Request, response: Response) {
    try {
      const result = await database
        .select("companies.*", "c.name as city", "s.abbreviation as state")
        .orderBy("company_id", "asc")
        .from("companies")
        .innerJoin("cities as c", "fk_city_id", "c.city_id")
        .innerJoin("states as s", "companies.fk_state_id", "s.state_id");

      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.handleError("Internal server error", 500);
    }
  }
}
