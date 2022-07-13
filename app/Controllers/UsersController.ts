import BaseController from './BaseController'
import UsersService from 'App/Services/UsersService'
import { IUsersController } from 'App/Interfaces/UsersInterface'
import { UsersPermissions } from 'App/Enums/Users'
import { TContext } from 'App/Types/Context'

export default class UsersController extends BaseController implements IUsersController {
  constructor() {
    super(new UsersService(), 'UsersController')
  }

  public async show(ctx: TContext) {
    const { bouncer, params } = ctx
    await bouncer.authorize(UsersPermissions.READ_USERS, { id: params.id })

    return super.show(ctx)
  }
}
