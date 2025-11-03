import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Category from './category.js'
import OrderItem from './order_item.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare categoryId: number

  @column()
  declare name: string

  @column()
  declare sku: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare basePrice: number

  @column()
  declare stock: number

  @column()
  declare unit: string

  @column()
  declare isActive: boolean

  @column()
  declare finish: string | null

  @column()
  declare wearLayer: string | null

  @column()
  declare thickness: string | null

  @column()
  declare dimensions: string | null

  @column()
  declare color: string | null

  @column()
  declare material: string | null

  @column()
  declare manufacturer: string | null

  @column()
  declare erpProductId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => OrderItem)
  declare orderItems: HasMany<typeof OrderItem>
}
