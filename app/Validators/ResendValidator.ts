import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { TContext } from 'App/Types/Context'

export default class ResendValidator {
  constructor(protected ctx: TContext) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.required()]),
  })

  public messages = {}
}
