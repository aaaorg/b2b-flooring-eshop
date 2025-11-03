import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('order_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')

      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('RESTRICT')

      table.string('product_name', 255).notNullable()
      table.string('product_sku', 100).notNullable()

      table.integer('quantity').notNullable()
      table.decimal('unit_price', 10, 2).notNullable()
      table.decimal('subtotal', 10, 2).notNullable()
      table.string('unit', 50).notNullable()

      table.json('product_attributes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['order_id'])
      table.index(['product_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
