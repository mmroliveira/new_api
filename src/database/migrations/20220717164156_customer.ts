import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("customer", function (table) {
    table.increments("customer_id").primary().notNullable();
    table.integer('fk_type_id').notNullable();
    table.string("register").notNullable().unique();
    table.string("name").notNullable();
    table.string("fantasy_name");
    table.integer("fk_country_id");
    table.integer("fk_state_id");
    table.integer("fk_city_id");
    table.string("street");
    table.string("neighborhood");
    table.string("number");
    table.string("zip_code");
    table.string("phone");
    table.string("cell");
    table.string("state_registration");
    table.string("logo_url");

    table.foreign("fk_type_id").references("type_id").inTable("type");
    table.foreign("fk_country_id").references("country_id").inTable("countries");
    table.foreign("fk_state_id").references("state_id").inTable("states");
    table.foreign("fk_city_id").references("city_id").inTable("cities");

    table.boolean("active_customer").notNullable().defaultTo(true);

    table.timestamp("created_at", { precision: 0 }).defaultTo(knex.fn.now(0));
    table.timestamp("updated_at", { precision: 0 }).defaultTo(knex.fn.now(0));
  });
}

export async function down(knex: Knex): Promise<void> {}
