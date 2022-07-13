import BaseRepository from './BaseRepository'
import Tenant from 'App/Models/Tenant'

import { ITenantsRepository } from 'App/Interfaces/TenantsInterface'

export default class TenantsRepository extends BaseRepository implements ITenantsRepository {
  constructor() {
    super(Tenant)
  }
}
