import BaseRepository from './BaseRepository'
import Role from 'App/Models/Role'

import { IRolesRepository } from 'App/Interfaces/RolesInterface'

export default class RolesRepository extends BaseRepository implements IRolesRepository {
  constructor() {
    super(Role)
  }
}
