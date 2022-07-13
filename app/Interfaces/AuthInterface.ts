import User from 'App/Models/User'
import { TAuth } from 'App/Types/Auth'
import { TContext } from 'App/Types/Context'
import { TUser } from 'App/Types/UsersType'
import { IBaseController } from './BaseInterface'

export interface IAuthController extends IBaseController {
  signup(ctx: TContext)
  login(ctx: TContext)
  validate(ctx: TContext)
  resend(ctx: TContext)
  logout(ctx: TContext)
}

export interface IAuthService {
  authenticate(auth: TAuth): Promise<TUser>
  generateToken(
    auth: TAuth,
    email: string,
    password: string
  ): Promise<{ type: string; token: string }>
  revoke(auth: TAuth): Promise<void>
  verifyPassword(hashPassword: string, password: string): Promise<boolean>
  generateShortId(user: User): Promise<string>
  getUserByShortId(shortId: string): Promise<User>
}
