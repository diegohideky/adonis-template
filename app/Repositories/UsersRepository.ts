import BaseRepository from './BaseRepository'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

import { IUsersRepository } from 'App/Interfaces/UsersInterface'

export default class UsersRepository extends BaseRepository implements IUsersRepository {
  private readonly relations: string[] = ['role']

  constructor() {
    super(User)
  }

  public async findById(id: string): Promise<ModelObject> {
    return super.findById(id, this.relations)
  }

  public async findByEmail(email: string): Promise<ModelObject> {
    const row = await this.model.findByOrFail('email', email)
    // @ts-ignore
    await Promise.all(this.relations.map(async (relation) => row.load(relation)))
    return row
  }
}
