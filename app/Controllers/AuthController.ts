import BaseController from './BaseController'
import Database from '@ioc:Adonis/Lucid/Database'
import UsersService from 'App/Services/UsersService'
import { IUsersService } from 'App/Interfaces/UsersInterface'
import AuthService from 'App/Services/AuthService'
import { IAuthController } from 'App/Interfaces/AuthInterface'
import { TContext } from 'App/Types/Context'
import { IRolesService } from 'App/Interfaces/RolesInterface'
import RolesService from 'App/Services/RolesService'
import { RolesAliases } from 'App/Enums/Roles'
import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class AuthController extends BaseController implements IAuthController {
  public usersService: IUsersService
  public rolesService: IRolesService

  constructor() {
    super(new AuthService(), 'AuthController')
    this.usersService = new UsersService()
    this.rolesService = new RolesService()
  }

  public async signup({ request, response, logId }: TContext) {
    const trx = await Database.transaction()
    const body = request.body()

    try {
      delete body['password_confirmation']

      const role = (await this.rolesService.findBy('alias', RolesAliases.OWNER)) as Role
      body.roleId = role?.toJSON ? role.toJSON().id : role.id

      this.logger.info(logId, this.location, 'Creating data', { body })
      const user = await this.usersService.save(body, trx)

      this.logger.info(logId, this.location, 'Generating shortid for user', { user: user })
      const shortid = await this.service.generateShortId(user.toJSON() as User)
      this.logger.info(logId, this.location, 'Shortid generated', { shortid })

      this.logger.info(logId, this.location, 'Commiting creation on data', { user })
      await trx.commit()
      this.logger.info(logId, this.location, 'Committed creation on data', { user })

      response.ok({ payload: shortid })
    } catch (error) {
      this.logger.error(logId, this.location, 'Rolling back on store', { error, body })
      await trx.rollback()
      this.logger.error(logId, this.location, 'Rolled back on store', { error, body })
      response.internalServerError(error.message)
    }
  }

  public async confirm({ request, response, logId }: TContext) {
    const trx = await Database.transaction()
    const body = request.body()
    const { token } = body

    try {
      this.logger.info(logId, this.location, 'Finding user by shortid', { token })
      const user = await this.service.getUserByShortId(token)

      if (!user) {
        this.logger.error(logId, this.location, 'Token has expired', { token })
        return response.notFound({ message: 'Token has expired' })
      }

      this.logger.info(logId, this.location, 'Confirming user', { user })
      await this.usersService.updateById(user.id, { confirmed: true }, trx)

      this.logger.info(logId, this.location, 'Commiting creation on data', { user })
      await trx.commit()
      this.logger.info(logId, this.location, 'Committed creation on data', { user })

      response.ok({ payload: true })
    } catch (error) {
      this.logger.error(logId, this.location, 'Rolling back on confirm', { error, body })
      await trx.rollback()
      this.logger.error(logId, this.location, 'Rolled back on confirm', { error, body })
      response.internalServerError(error.message)
    }
  }

  public async resend({ request, response, logId }: TContext) {
    const body = request.body()
    const { email } = body

    try {
      this.logger.info(logId, this.location, 'Finding user by email', { email })
      const user = await this.usersService.findByEmail(email)

      if (user.confirmed) {
        this.logger.warn(logId, this.location, 'User already confirmed', { user })
        return response.badRequest('User already confirmed')
      }

      this.logger.info(logId, this.location, 'Generating shortid for user', { user })
      const shortid = await this.service.generateShortId(user.toJSON() as User)
      this.logger.info(logId, this.location, 'Shortid generated', { shortid })

      response.ok({ payload: shortid })
    } catch (error) {
      this.logger.error(logId, this.location, 'Rolling back on confirm', { error, body })
      this.logger.error(logId, this.location, 'Rolled back on confirm', { error, body })
      response.internalServerError(error.message)
    }
  }

  public async login({ auth, request, response, logId }: TContext) {
    const body = request.body()

    try {
      const user = await this.usersService.findByEmail(body.email)

      if (!user.confirmed) {
        this.logger.error(logId, this.location, 'User not confirmed', { user })
        return response.badRequest('User not confirmed. Please check your email')
      }

      const verified = await this.service.verifyPassword(user.password, body.password)
      if (!verified) {
        this.logger.error(logId, this.location, 'Password is invalid', {
          password: body.password,
          user,
        })
        return response.badRequest('Invalid password')
      }

      const { token } = await this.service.generateToken(auth, body.email, body.password)

      this.logger.info(logId, this.location, `Generated token for user id ${user.id}`, { token })

      response.ok({ payload: { token, user } })
    } catch (error) {
      this.logger.error(logId, this.location, 'Error on making login', { error, body })
      response.internalServerError(error.message)
    }
  }

  public async validate({ auth, response, logId }: TContext) {
    try {
      this.logger.info(logId, this.location, 'Validating token', {})
      const user = await this.service.authenticate(auth)
      this.logger.info(logId, this.location, 'Validated token', { user })

      await user.load('role')

      response.ok({ payload: user })
    } catch (error) {
      this.logger.error(logId, this.location, 'Error on making login', { error })
      throw error
    }
  }

  public async logout({ auth, response, logId }: TContext) {
    this.logger.info(logId, this.location, `Loggin out user #${auth.user}`, { user: auth.user })
    await this.service.revoke(auth)
    this.logger.info(logId, this.location, `User #${auth.user} logged out`, { user: auth.user })

    response.ok({ payload: true })
  }
}
