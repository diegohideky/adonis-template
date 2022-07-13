import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { TContext } from 'App/Types/Context'

export default class LoginValidator {
  constructor(protected ctx: TContext) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.required()]),
    password: schema.string({}, [
      rules.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
      rules.required(),
    ]),
  })

  public messages = {}
}
