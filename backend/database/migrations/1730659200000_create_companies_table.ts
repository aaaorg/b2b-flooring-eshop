import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.string('registration_number', 50).nullable().unique()
      table.string('tax_id', 50).nullable()
      table.string('address', 255).nullable()
      table.string('city', 100).nullable()
      table.string('postal_code', 20).nullable()
      table.string('country', 100).notNullable().defaultTo('Czech Republic')
      table.string('phone', 50).nullable()
      table.string('email', 255).nullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.string('erp_customer_id', 100).nullable().unique()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
