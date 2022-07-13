import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { RolesAliases } from 'App/Enums/Roles'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const adminRole = await Role.findByOrFail('alias', RolesAliases.ADMIN)
    const ownerRole = await Role.findByOrFail('alias', RolesAliases.OWNER)
    const employeeRole = await Role.findByOrFail('alias', RolesAliases.EMPLOYEE)

    await User.updateOrCreateMany('email', [
      {
        roleId: adminRole.id,
        name: 'Administrator',
        username: 'administrator',
        email: 'admin@example.com',
        password: 'Test1234!',
        confirmed: true,
      },
      {
        roleId: ownerRole.id,
        name: 'Owner',
        username: 'owner',
        email: 'owner@example.com',
        password: 'Test1234!',
        confirmed: true,
      },
      {
        roleId: employeeRole.id,
        name: 'Employee',
        username: 'employee',
        email: 'employee@example.com',
        password: 'Test1234!',
        confirmed: true,
      },
    ])
  }
}
