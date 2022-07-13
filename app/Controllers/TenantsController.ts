import BaseController from './BaseController'
import TenantsService from 'App/Services/TenantsService'

import { ITenantsController } from 'App/Interfaces/TenantsInterface'
import { TContext } from 'App/Types/Context'
import Database from '@ioc:Adonis/Lucid/Database'
import { IUsersTenantsService } from 'App/Interfaces/UsersTenantsInterface'
import UsersTenantsService from 'App/Services/UsersTenantsService'
import { TenantsPermissions } from 'App/Enums/Tenants'

export default class TenantsController extends BaseController implements ITenantsController {
  public usersTenantsService: IUsersTenantsService

  constructor() {
    super(new TenantsService(), 'TenantsController')

    this.usersTenantsService = new UsersTenantsService()
  }

  public async store(ctx: TContext) {
    const { bouncer, request, response, logId } = ctx
    await bouncer.authorize(TenantsPermissions.CREATE_TENANTS)

    const trx = await Database.transaction()
    const body = request.body()

    try {
      this.logger.info(logId, this.location, 'Creating data', { body })
      const tenant = (await this.service.save(body, trx)).toJSON()

      await this.usersTenantsService.save(
        {
          userId: tenant.ownerId,
          tenantId: tenant.id,
        },
        trx
      )

      this.logger.info(logId, this.location, 'Commiting creation on data', { tenant })
      await trx.commit()
      this.logger.info(logId, this.location, 'Committed creation on data', { tenant })

      response.ok({ payload: tenant })
    } catch (error) {
      this.logger.error(logId, this.location, 'Rolling back on store', { error, body })
      await trx.rollback()
      this.logger.error(logId, this.location, 'Rolled back on store', { error, body })
      response.internalServerError(error.message)
    }
  }

  public async update(ctx: TContext) {
    const { bouncer, params } = ctx
    const tenant = await this.service.findById(params.id)
    await bouncer.authorize(TenantsPermissions.UPDATE_TENANTS, tenant)

    return super.update(ctx)
  }

  public async destroy(ctx: TContext) {
    const { bouncer, params } = ctx

    const tenant = await this.service.findById(params.id)
    await bouncer.authorize(TenantsPermissions.DELETE_TENANTS, tenant)

    return super.destroy(ctx)
  }
}
