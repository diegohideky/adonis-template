import * as shortid from 'shortid'
import Hash from '@ioc:Adonis/Core/Hash'
import Config from '@ioc:Adonis/Core/Config'
import { TUser } from 'App/Types/UsersType'
import { IAuthService } from 'App/Interfaces/AuthInterface'
import { TAuth } from 'App/Types/Auth'
import User from 'App/Models/User'
import BaseService from './BaseService'
import UsersRepository from 'App/Repositories/UsersRepository'

export default class AuthService extends BaseService implements IAuthService {
  constructor() {
    super(new UsersRepository(), 'auth')
  }

  public async authenticate(auth: TAuth): Promise<TUser> {
    await auth.use('api').authenticate()
    return auth.use('api').user as TUser
  }

  public async revoke(auth: TAuth): Promise<void> {
    return auth.use('api').revoke()
  }

  public async generateToken(
    auth: TAuth,
    email: string,
    password: string
  ): Promise<{ type: string; token: string }> {
    const expiresIn = Config.get('app.tokenExpiration')
    return auth.use('api').attempt(email, password, { expiresIn })
  }

  public async verifyPassword(hashPassword: string, password: string): Promise<boolean> {
    return Hash.verify(hashPassword, password)
  }

  public async generateShortId(user: User): Promise<string> {
    const id = shortid.generate()

    await this.redisService.set(`${this.cachePrefix}:token:${id}`, user)

    return id
  }

  public async getUserByShortId(shortId: string): Promise<User> {
    return this.redisService.get(`${this.cachePrefix}:token:${shortId}`)
  }
}
