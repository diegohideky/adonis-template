import { IBaseController, IBaseService, IBaseRepository } from './BaseInterface'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'

export interface IUsersController extends IBaseController {}
export interface IUsersService extends IBaseService {
  findByEmail(email: string): Promise<ModelObject>
}
export interface IUsersRepository extends IBaseRepository {
  findByEmail(email: string): Promise<ModelObject>
}
