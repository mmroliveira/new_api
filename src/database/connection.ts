import knex from "knex";
import configuration from "../../knexfile";

const environment = process.env.DB_ENV || "development";
const database = knex(configuration[environment]);

export { database };
