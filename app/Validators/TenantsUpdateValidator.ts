import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { TContext } from 'App/Types/Context'

export default class TenantsUpdateValidator {
  constructor(protected ctx: TContext) {}

  public schema = schema.create({
    name: schema.string({}, [rules.minLength(5)]),
    ownerId: schema.string({}, [rules.uuid(), rules.required()]),
    logo: schema.string({}, [rules.url(), rules.nullable()]),
    active: schema.boolean(),
  })

  public messages = {}
}
