import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("countries", function (table) {
    table.increments("country_id").primary().notNullable();
    table.string("abbreviation").notNullable().unique();
    table.string("name").notNullable().unique();

    table.boolean("active_country").notNullable().defaultTo(true);

    table.timestamp("created_at", { precision: 0 }).defaultTo(knex.fn.now(0));
    table.timestamp("updated_at", { precision: 0 }).defaultTo(knex.fn.now(0));
  });
}

export async function down(knex: Knex): Promise<void> {}
