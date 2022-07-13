import BaseService from './BaseService'
import RolesRepository from 'App/Repositories/RolesRepository'

import { IRolesService } from 'App/Interfaces/RolesInterface'

export default class RolesService extends BaseService implements IRolesService {
  constructor() {
    super(new RolesRepository(), 'Roles')
  }
}
