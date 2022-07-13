import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  beforeUpdate,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import Hash from '@ioc:Adonis/Core/Hash'
import Role from './Role'

export default class User extends BaseModel {
  public static table = 'users'
  public static primaryKey = 'uuid'

  @column({ serializeAs: null })
  public testId: string

  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'roleId' })
  public roleId: string

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @column()
  public name: string

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public confirmed: boolean

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(item: User) {
    if (!item.id) {
      item.id = uuidv4()
    }

    if (process.env.NODE_ENV === 'test' && !item.testId) {
      item.testId = uuidv4()
    }
  }

  @beforeSave()
  @beforeUpdate()
  public static async hashPassword(item: User) {
    if (item.$dirty.password) {
      item.password = await Hash.make(item.password)
    }
  }
}
