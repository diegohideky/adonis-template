import { schema, rules } from '@ioc:Adonis/Core/Validator'
import CommonQueryStringSchema from 'App/Schemas/CommonQueryStringSchema'
import { TContext } from 'App/Types/Context'

export default class TenantsQueryValidator {
  constructor(protected ctx: TContext) {}

  public schema = schema.create({
    ...CommonQueryStringSchema,
    ownerId: schema.string.optional({}, [rules.uuid()]),
    name: schema.string.optional({}, [rules.minLength(3)]),
    active: schema.boolean.optional(),
  })

  public messages = {}
}
