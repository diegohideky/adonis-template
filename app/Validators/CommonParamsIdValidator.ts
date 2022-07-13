import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { TContext } from 'App/Types/Context'

export default class CommonParamsIdValidator {
  constructor(protected ctx: TContext) {}

  public schema = schema.create({
    id: schema.string({}, [rules.uuid()]),
  })
  public messages = {}
}
