import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { TContext } from 'App/Types/Context'

export default class TenantsCreateValidator {
  constructor(protected ctx: TContext) {}

  public schema = schema.create({
    name: schema.string({}, [rules.minLength(5), rules.required()]),
    ownerId: schema.string({}, [rules.uuid(), rules.required()]),
    logo: schema.string({}, [rules.url(), rules.nullable()]),
  })

  public messages = {}
}
