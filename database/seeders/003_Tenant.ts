import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Tenant from 'App/Models/Tenant'
import User from 'App/Models/User'

export default class TenantSeeder extends BaseSeeder {
  public async run() {
    const user = await User.findByOrFail('email', 'admin@example.com')

    const tenants = Array(3)
      .fill(0)
      .map((_, index) => ({
        ownerId: user.id,
        name: `Tenant ${index + 1}`,
        active: true,
      }))

    await Tenant.updateOrCreateMany('name', tenants)
  }
}
