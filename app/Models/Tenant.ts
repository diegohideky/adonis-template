import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Tenant extends BaseModel {
  public static table = 'tenants'
  public static primaryKey = 'uuid'

  @column({ serializeAs: null })
  public testId: string

  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'ownerId' })
  public ownerId: string

  @belongsTo(() => User)
  public owner: BelongsTo<typeof User>

  @column()
  public name: string

  @column()
  public logo: string

  @column()
  public active: boolean

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(item: Tenant) {
    if (!item.id) {
      item.id = uuidv4()
    }

    if (process.env.NODE_ENV === 'test' && !item.testId) {
      item.testId = uuidv4()
    }
  }
}
