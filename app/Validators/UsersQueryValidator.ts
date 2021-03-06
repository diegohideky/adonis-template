import { schema } from '@ioc:Adonis/Core/Validator'
import CommonQueryStringSchema from 'App/Schemas/CommonQueryStringSchema'
import { TContext } from 'App/Types/Context'

export default class UsersQueryValidator {
  constructor(protected ctx: TContext) {}

  public schema = schema.create({
    ...CommonQueryStringSchema,
  })

  public messages = {}
}
