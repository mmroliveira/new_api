import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("suppliers", (table) => {
    table.integer("fk_country_cell");
    table.integer("fk_country_phone");

    table.foreign('fk_country_cell').references('country_id').inTable('countries');
    table.foreign('fk_country_phone').references('country_id').inTable('countries');

  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('suppliers', table => {
    table.dropColumn('fk_country_cell');
    table.dropColumn('fk_country_phone');
  })
}
