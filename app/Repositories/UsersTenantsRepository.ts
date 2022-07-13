import BaseRepository from './BaseRepository'
import UserTenant from 'App/Models/UserTenant'

import { IUsersTenantsRepository } from 'App/Interfaces/UsersTenantsInterface'

export default class UsersTenantsRepository
  extends BaseRepository
  implements IUsersTenantsRepository
{
  constructor() {
    super(UserTenant)
  }
}
