import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Tenant from './Tenant'

export default class UserTenant extends BaseModel {
  public static table = 'users_tenants'
  public static primaryKey = 'uuid'

  @column({ serializeAs: null })
  public testId: string

  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'userId' })
  public userId: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column({ serializeAs: 'tenantId' })
  public tenantId: string

  @belongsTo(() => Tenant)
  public tenant: BelongsTo<typeof Tenant>

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(item: UserTenant) {
    if (!item.id) {
      item.id = uuidv4()
    }

    if (process.env.NODE_ENV === 'test' && !item.testId) {
      item.testId = uuidv4()
    }
  }
}
