import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('company_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')

      table.string('full_name', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.string('phone', 50).nullable()
      table.enum('role', ['admin', 'customer', 'sales']).notNullable().defaultTo('customer')
      table.boolean('is_active').notNullable().defaultTo(true)
      table.boolean('is_approved').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
