import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("receipts", function (table) {
    table.increments("receipt_id").primary().notNullable();
    table.string("amount").notNullable();
    table.string("regarding").notNullable();
    table.integer("fk_company_id").notNullable();
    table.integer("payer").notNullable();
    table.integer("receiver").notNullable();
    table.string("created_by").notNullable();
    table.string("date").notNullable();
    table.integer("currency").notNullable();
    table.integer("fk_nature_id").notNullable();
    table.integer("fk_cost_center_id").notNullable();

    table.integer("fk_status_id").notNullable();

    table.foreign("fk_company_id").references("company_id").inTable("companies");
    table.foreign("payer").references("supplier_id").inTable("suppliers");
    table.foreign("receiver").references("supplier_id").inTable("suppliers");
    table.foreign("fk_status_id").references("status_id").inTable("status");
    table.foreign("created_by").references("user_id").inTable("users");
    table.foreign("currency").references("currency_id").inTable("currency");
    table.foreign("fk_nature_id").references("nature_id").inTable("nature");
    table.foreign("fk_cost_center_id").references("cost_center_id").inTable("cost_center");
    
    table.boolean("active_receipt").notNullable().defaultTo(true);

    table.timestamp("created_at", { precision: 0 }).defaultTo(knex.fn.now(0));
    table.timestamp("updated_at", { precision: 0 }).defaultTo(knex.fn.now(0));
    
  });
}

export async function down(knex: Knex): Promise<void> {}
