import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { TContext } from 'App/Types/Context'

export default class ConfirmValidator {
  constructor(protected ctx: TContext) {}

  public schema = schema.create({
    token: schema.string({}, [rules.required(), rules.minLength(9)]),
  })

  public messages = {}
}
