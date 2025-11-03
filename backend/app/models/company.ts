import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare registrationNumber: string | null

  @column()
  declare taxId: string | null

  @column()
  declare address: string | null

  @column()
  declare city: string | null

  @column()
  declare postalCode: string | null

  @column()
  declare country: string

  @column()
  declare phone: string | null

  @column()
  declare email: string | null

  @column()
  declare isActive: boolean

  @column()
  declare erpCustomerId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => User)
  declare users: HasMany<typeof User>
}
