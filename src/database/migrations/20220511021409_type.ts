import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("type", function (table) {
    table.increments("type_id").primary().notNullable();
    table.string("name").notNullable();
    
    table.boolean("active_type").notNullable().defaultTo(true);

    table.timestamp("created_at", { precision: 0 }).defaultTo(knex.fn.now(0));
    table.timestamp("updated_at", { precision: 0 }).defaultTo(knex.fn.now(0));
  });
}

export async function down(knex: Knex): Promise<void> {}
