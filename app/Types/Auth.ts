import { HttpContext } from '@adonisjs/core/build/standalone'
import { AuthManagerContract } from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/User'
import { TUser } from './UsersType'

export type TAuth = {
  authenticationAttempted: Function
  config: Function
  ctx: HttpContext
  defaultGuard: string
  isAuthenticated: Function
  isGuest: Function
  isLoggedIn: Function
  isLoggedOut: Function
  manager: AuthManagerContract
  mappingsCache: Map<string, any>
  user: User
  use: Function
}

export type TSignupParams = {
  password_confirmation: string
} & TUser
