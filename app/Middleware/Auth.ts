import Config from '@ioc:Adonis/Core/Config'
import { TContext } from 'App/Types/Context'
import LoggerService from 'App/Services/LoggerService'
import RolesService from 'App/Services/RolesService'
import { BelongsTo, LucidModel } from '@ioc:Adonis/Lucid/Orm'
import Role from 'App/Models/Role'
import UsersTenantsService from 'App/Services/UsersTenantsService'
import UserTenant from 'App/Models/UserTenant'

export default class Auth {
  public async handle(ctx: TContext, next: () => Promise<void>) {
    const location = 'AuthMiddleware'
    const { request, logId, auth } = ctx

    const logger = new LoggerService()
    const rolesService = new RolesService()
    const usersTenantsService = new UsersTenantsService()

    const url = request.url()

    logger.info(logId, location, `Accessing ${url}`, {})
    if (!url.includes(Config.get('app.apiV1') + '/auth')) {
      logger.info(logId, location, 'Authenticating', {})
      await auth.use('api').authenticate()

      const role = await rolesService.findById(ctx.auth.user.roleId)
      ctx.auth.user.role = role as BelongsTo<typeof Role, LucidModel>

      const usersTenants = await usersTenantsService.findAll({
        query: { userId: ctx.auth.user.id },
      })

      ctx.auth.user['tenants'] = usersTenants.map((userTenant: UserTenant) => userTenant.tenantId)

      logger.info(logId, location, `User #${ctx.auth.user.id} authenticated`, {})
    }

    await next()
  }
}
