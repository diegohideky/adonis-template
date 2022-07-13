import { TContext } from 'App/Types/Context'
import { RolesAliases } from 'App/Enums/Roles'

export default class ParseOwnerToBody {
  public async handle(ctx: TContext, next: () => Promise<void>) {
    const { request } = ctx

    if (ctx.auth.user.role.alias === RolesAliases.OWNER) {
      const body = request.body()
      request.updateBody({
        ...body,
        ownerId: ctx.auth.user.id,
      })
    }

    await next()
  }
}
