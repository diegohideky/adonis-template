import BaseService from './BaseService'
import TenantsRepository from 'App/Repositories/TenantsRepository'

import { ITenantsService } from 'App/Interfaces/TenantsInterface'

export default class TenantsService extends BaseService implements ITenantsService {
  constructor() {
    super(new TenantsRepository(), 'Tenants')
  }
}
