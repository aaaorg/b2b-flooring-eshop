import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, type BelongsTo } from '@adonisjs/lucid/orm'
import ShoppingList from '#models/shopping_list'
import Product from '#models/product'

export default class ShoppingListItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare shoppingListId: number

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @belongsTo(() => ShoppingList)
  declare shoppingList: BelongsTo<typeof ShoppingList>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}