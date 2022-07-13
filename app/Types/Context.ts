import { HttpContext } from '@adonisjs/core/build/standalone'
import { TAuth } from './Auth'

export type TContext = {
  logId: string
  auth: TAuth
  bouncer: any
} & HttpContext
