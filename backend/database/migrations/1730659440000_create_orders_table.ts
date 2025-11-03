import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')

      table
        .integer('company_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('companies')
        .onDelete('RESTRICT')

      table.string('order_number', 50).notNullable().unique()
      table.enum('order_type', ['purchase', 'reservation']).notNullable()
      table
        .enum('status', ['pending_sync', 'synced', 'failed', 'processing', 'completed', 'cancelled'])
        .notNullable()
        .defaultTo('pending_sync')

      table.decimal('total_amount', 10, 2).notNullable()
      table.string('currency', 10).notNullable().defaultTo('CZK')

      table.enum('payment_status', ['pending', 'paid', 'failed', 'refunded']).nullable()
      table.string('payment_method', 50).nullable()
      table.string('payment_transaction_id', 255).nullable()

      table.string('shipping_address', 255).nullable()
      table.string('shipping_city', 100).nullable()
      table.string('shipping_postal_code', 20).nullable()
      table.string('shipping_country', 100).nullable()

      table.text('notes').nullable()

      table.string('erp_order_id', 100).nullable().unique()
      table.integer('sync_retries').notNullable().defaultTo(0)
      table.timestamp('last_sync_attempt', { useTz: true }).nullable()
      table.text('sync_error_message').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['user_id', 'status'])
      table.index(['company_id', 'status'])
      table.index(['order_type', 'status'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
