import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("cities", function (table) {
    table.integer("city_id").primary().notNullable();
    table.string("name").notNullable();
    table.integer("fk_state_id").notNullable();

    table.foreign("fk_state_id").references("state_id").inTable("states");

    table.boolean("active_city").notNullable().defaultTo(true);

    table.timestamp("created_at", { precision: 0 }).defaultTo(knex.fn.now(0));
    table.timestamp("updated_at", { precision: 0 }).defaultTo(knex.fn.now(0));
  });
}

export async function down(knex: Knex): Promise<void> {}
