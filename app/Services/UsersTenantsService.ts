import BaseService from './BaseService'
import UsersTenantsRepository from 'App/Repositories/UsersTenantsRepository'

import { IUsersTenantsService } from 'App/Interfaces/UsersTenantsInterface'

export default class UsersTenantsService extends BaseService implements IUsersTenantsService {
  constructor() {
    super(new UsersTenantsRepository(), 'UsersTenants')
  }
}
