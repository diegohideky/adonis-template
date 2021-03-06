import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class Role extends BaseModel {
  public static table = 'roles'
  public static primaryKey = 'uuid'

  @column({ serializeAs: null })
  public testId: string

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public alias: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(item: Role) {
    if (!item.id) {
      item.id = uuidv4()
    }

    if (process.env.NODE_ENV === 'test' && !item.testId) {
      item.testId = uuidv4()
    }
  }
}
