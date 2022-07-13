import BaseService from './BaseService'
import UsersRepository from 'App/Repositories/UsersRepository'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { IUsersService } from 'App/Interfaces/UsersInterface'

export default class UsersService extends BaseService implements IUsersService {
  constructor() {
    super(new UsersRepository(), 'Users')
  }

  public async findById(id: string): Promise<ModelObject> {
    return this.repository.findById(id)
  }

  public async findByEmail(email: string): Promise<ModelObject> {
    return this.repository.findByEmail(email)
  }
}
