import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("currency", function (table) {
    table.increments("currency_id").primary().notNullable();
    table.string("name").notNullable();
    table.string("abbreviation").notNullable();

    table.boolean("active_currency").notNullable().defaultTo(true);

    table.timestamp("created_at", { precision: 0 }).defaultTo(knex.fn.now(0));
    table.timestamp("updated_at", { precision: 0 }).defaultTo(knex.fn.now(0));
  });
}

export async function down(knex: Knex): Promise<void> {}
