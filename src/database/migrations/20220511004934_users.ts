import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.string("user_id").primary().notNullable();
    table.string("user_name").notNullable().unique();
    table.string("password").notNullable();
    table.string("name").notNullable();
    table.string("cpf").notNullable().unique();
    table.string("pis").unique();
    table.string("occupation");
    table.string("birth_date");
    table.string("admission_date");
    table.string("photo_url");
    table.boolean("active_user").notNullable().defaultTo(true);

    table.timestamp("created_at", { precision: 0 }).defaultTo(knex.fn.now(0));
    table.timestamp("updated_at", { precision: 0 }).defaultTo(knex.fn.now(0));
  });
}

export async function down(knex: Knex): Promise<void> {}
