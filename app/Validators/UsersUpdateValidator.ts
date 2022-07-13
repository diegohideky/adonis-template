import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { TContext } from 'App/Types/Context'

export default class UsersUpdateValidator {
  constructor(protected ctx: TContext) {}

  public schema = schema.create({
    name: schema.string({}, [rules.minLength(5)]),
    username: schema.string({}, [rules.minLength(5)]),
    email: schema.string({}, [rules.email()]),
  })

  public messages = {}
}
