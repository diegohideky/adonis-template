import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Tenant from 'App/Models/Tenant'
import User from 'App/Models/User'
import UserTenant from 'App/Models/UserTenant'

export default class UserTenantSeeder extends BaseSeeder {
  public async run() {
    const user = await User.findByOrFail('email', 'admin@example.com')

    const tenants = await Tenant.all()

    const usersTenants = tenants.map((tenant) => ({
      tenantId: tenant.id,
      userId: user.id,
    }))

    await UserTenant.updateOrCreateMany('tenantId', usersTenants)
  }
}
