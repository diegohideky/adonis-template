import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { RolesAliases } from 'App/Enums/Roles'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    await Role.updateOrCreateMany('name', [
      {
        name: 'Administrator',
        alias: RolesAliases.ADMIN,
      },
      {
        name: 'Owner',
        alias: RolesAliases.OWNER,
      },
      {
        name: 'Employee',
        alias: RolesAliases.EMPLOYEE,
      },
    ])
  }
}
