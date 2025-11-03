import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Company from './company.js'
import OrderItem from './order_item.js'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare companyId: number

  @column()
  declare orderNumber: string

  @column()
  declare orderType: 'purchase' | 'reservation'

  @column()
  declare status:
    | 'pending_sync'
    | 'synced'
    | 'failed'
    | 'processing'
    | 'completed'
    | 'cancelled'

  @column()
  declare totalAmount: number

  @column()
  declare currency: string

  @column()
  declare paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | null

  @column()
  declare paymentMethod: string | null

  @column()
  declare paymentTransactionId: string | null

  @column()
  declare shippingAddress: string | null

  @column()
  declare shippingCity: string | null

  @column()
  declare shippingPostalCode: string | null

  @column()
  declare shippingCountry: string | null

  @column()
  declare notes: string | null

  @column()
  declare erpOrderId: string | null

  @column()
  declare syncRetries: number

  @column.dateTime()
  declare lastSyncAttempt: DateTime | null

  @column()
  declare syncErrorMessage: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>
}
