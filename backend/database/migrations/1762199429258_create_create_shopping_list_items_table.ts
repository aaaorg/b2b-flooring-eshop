import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shopping_list_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('shopping_list_id').unsigned().references('id').inTable('shopping_lists').onDelete('CASCADE')
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE')
      table.integer('quantity').notNullable().defaultTo(1)

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Ensure unique product per shopping list
      table.unique(['shopping_list_id', 'product_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}