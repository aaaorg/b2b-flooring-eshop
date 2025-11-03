import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, type BelongsTo, type HasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import ShoppingListItem from '#models/shopping_list_item'

export default class ShoppingList extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => ShoppingListItem)
  declare items: HasMany<typeof ShoppingListItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}