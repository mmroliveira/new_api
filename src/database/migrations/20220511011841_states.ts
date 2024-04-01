import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("states", function (table) {
    table.integer("state_id").primary().notNullable();
    table.string("abbreviation").notNullable().unique();
    table.string("name").notNullable().unique();
    table.integer("fk_country_id").notNullable();

    table.foreign("fk_country_id").references("country_id").inTable("countries");

    table.boolean("active_state").notNullable().defaultTo(true);

    table.timestamp("created_at", { precision: 0 }).defaultTo(knex.fn.now(0));
    table.timestamp("updated_at", { precision: 0 }).defaultTo(knex.fn.now(0));
  });
}

export async function down(knex: Knex): Promise<void> {}
