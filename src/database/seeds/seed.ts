import knex, { Knex } from "knex";

import { states } from "../../resources/states";
import { cities } from "../../resources/cities";

import uniqid from "uniqid";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").insert([
    {
      user_id: uniqid(),
      user_name: "murilo.oliveira",
      password: "qwer",
      name: "Murilo Gonzaga de Oliveira",
      cpf: "01915331145",
      pis: "16606948224",
      occupation: "Auxiliar administrativo",
      birth_date: "14/10/1994",
      admission_date: "11/09/2020",
    },
  ]);

  await knex("type").insert([
    { name: "Física" },
    { name: "Jurídica" },
    { name: "Extrangeiro" },
  ]);

  await knex("status").insert([{ name: "Ativo" }, { name: "Desativado" }]);

  await knex("countries").insert([
    { name: "Brasil", abbreviation: "BR" },
    { name: "Paraguay", abbreviation: "PY" },
  ]);

  await knex("states").insert(
    states.map((item) => {
      return {
        name: item.name,
        abbreviation: item.abbreviation,
        state_id: item.state_id,
        fk_country_id: item.country,
      };
    })
  );

  await knex("cities").insert(
    cities.map((item) => {
      return {
        city_id: item.id,
        name: item.name,
        fk_state_id: item.state_id,
      };
    })
  );

  await knex("suppliers").insert([
    {
      fk_type_id: 2,
      register: "12.645.814/0003-24",
      name: "Globalmax Indústria Plástica S/A",
      fantasy_name: "Globalmax MS",
      fk_country_id: 1,
      fk_state_id: 50,
      fk_city_id: 5006606,
      street: "Piauí",
      neighborhood: "São Domingos",
      number: "200",
      zip_code: "79906-614",
      phone: "(67) 3433-3030",
      cell: "+55 (67) 9 9870-3477",
      state_registration: "28.400.056-6",
      logo_url: null,
      created_at: "2022-06-23 21:19:17-04",
    },
    {
      fk_type_id: 2,
      register: "10.709.589/0001-55",
      name: "Laca Transportes LTDA EPP",
      fantasy_name: "Laca Transportes",
      fk_country_id: 1,
      fk_state_id: 50,
      fk_city_id: 5006606,
      street: "Piauí",
      neighborhood: "São Domingos",
      number: "200",
      zip_code: "79906-614",
      phone: "(67) 3433-3030",
      cell: "+55 (67) 9 9870-3477",
      state_registration: "28.428.070-4",
      logo_url: null,
      created_at: "2022-06-23 21:19:17-04",
    },
    {
      fk_type_id: 1,
      register: "019.153.311-45",
      name: "Murilo Gonzaga de Oliveira",
      fantasy_name: null,
      fk_country_id: 1,
      fk_state_id: 50,
      fk_city_id: 5006606,
      street: "Rua Seriguela",
      neighborhood: "Residencial Ponta Porã I",
      number: "500",
      zip_code: "79902-426",
      phone: "(67) 3433-3030",
      cell: "+55 (67) 9 9870-3477",
      state_registration: null,
      logo_url: null,
      created_at: "2022-06-27 21:19:17-04",
    },
    {
      fk_type_id: 1,
      register: "123.477.999-40",
      name: "Bruna Rafaela dos Santos",
      fantasy_name: null,
      fk_country_id: 1,
      fk_state_id: null,
      fk_city_id: null,
      street: null,
      neighborhood: null,
      number: null,
      zip_code: null,
      phone: null,
      cell: "+55 (44) 9 99447-359",
      state_registration: null,
      logo_url: null,
      created_at: "2022-06-29 21:19:17-04",
    },
    {
      fk_type_id: 3,
      register: "4404520",
      name: "Rene Salinas",
      fantasy_name: null,
      fk_country_id: 2,
      fk_state_id: null,
      fk_city_id: null,
      street: null,
      neighborhood: null,
      number: null,
      zip_code: null,
      phone: null,
      cell: "973 870235",
      state_registration: null,
      logo_url: null,
      created_at: "2022-07-04 21:19:17-04",
    },
    {
      fk_type_id: 1,
      register: "063.527.481-71",
      name: "William Vera da Silva",
      fantasy_name: null,
      fk_country_id: 1,
      fk_state_id: null,
      fk_city_id: null,
      street: null,
      neighborhood: null,
      number: null,
      zip_code: null,
      phone: null,
      cell: "+55 (67) 9 98518-661",
      state_registration: null,
      logo_url: null,
      created_at: "2022-07-05 21:19:17-04",
    },
    {
      fk_type_id: 1,
      register: "862.295.591-53",
      name: "Angela Maria Carvalho",
      fantasy_name: null,
      fk_country_id: 1,
      fk_state_id: null,
      fk_city_id: null,
      street: null,
      neighborhood: null,
      number: null,
      zip_code: null,
      phone: null,
      cell: "+55 (67) 9 9342-7111",
      state_registration: null,
      logo_url: null,
      created_at: "2022-07-12 21:19:17-04",
    },
    {
      fk_type_id: 1,
      register: "021.686.171-39",
      name: "Isaias Cardozo Raulino",
      fantasy_name: null,
      fk_country_id: 1,
      fk_state_id: null,
      fk_city_id: null,
      street: null,
      neighborhood: null,
      number: null,
      zip_code: null,
      phone: null,
      cell: "+55 (67) 99 6055-128",
      state_registration: null,
      logo_url: null,
      created_at: "2022-07-12 21:19:17-04",
    },
  ]);

  await knex("companies").insert([
    {
      fk_type_id: 1,
      register: "12.645.814/0003-24",
      name: "Globalmax Indústria Plástica S/A",
      fantasy_name: "Globalmax MS",
      fk_country_id: 1,
      fk_state_id: 50,
      fk_city_id: 5006606,
      street: "Piauí",
      neighborhood: "São Domingos",
      number: "200",
      zip_code: "79906-614",
      phone: "(67) 3433-3030",
      cell: "+55 (67) 9 9870-3477",
      state_registration: "28.400.056-6",
      logo_url: null,
    },
    {
      fk_type_id: 1,
      register: "10.709.589/0001-55",
      name: "Laca Transportes LTDA EPP",
      fantasy_name: "Laca Transportes",
      fk_country_id: 1,
      fk_state_id: 50,
      fk_city_id: 5006606,
      street: "Piauí",
      neighborhood: "São Domingos",
      number: "200",
      zip_code: "79906-614",
      phone: "(67) 3433-3030",
      cell: "+55 (67) 9 9870-3477",
      state_registration: "28.428.070-4",
      logo_url: null,
    },
  ]);

  await knex("currency").insert([
    { name: "Real", abbreviation: "R$" },
    { name: "Dólar", abbreviation: "$" },
    { name: "Guaraní", abbreviation: "₲" },
  ]);

  await knex("nature").insert([
    { name: "Prestação de serviço" },
    { name: "Manutenção predial" },
    { name: "Serviço de diarista" },
  ]);

  await knex("cost_center").insert([
    { name: "Globalmax MS" },
    { name: "Laca Transportes" },
  ]);
}
