import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('category_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('RESTRICT')

      table.string('name', 255).notNullable()
      table.string('sku', 100).notNullable().unique()
      table.string('slug', 255).notNullable().unique()
      table.text('description').nullable()
      table.decimal('base_price', 10, 2).notNullable()
      table.integer('stock').notNullable().defaultTo(0)
      table.string('unit', 50).notNullable().defaultTo('m²')
      table.boolean('is_active').notNullable().defaultTo(true)

      table.string('finish', 100).nullable()
      table.string('wear_layer', 50).nullable()
      table.string('thickness', 50).nullable()
      table.string('dimensions', 100).nullable()
      table.string('color', 100).nullable()
      table.string('material', 100).nullable()
      table.string('manufacturer', 100).nullable()
      table.string('erp_product_id', 100).nullable().unique()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['category_id', 'is_active'])
      table.index(['stock'])
      table.index(['finish'])
      table.index(['wear_layer'])
      table.index(['material'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
