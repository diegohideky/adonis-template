import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { TContext } from 'App/Types/Context'

export default class SignupCreateValidator {
  constructor(protected ctx: TContext) {}

  public schema = schema.create({
    name: schema.string({}, [rules.minLength(5), rules.required()]),
    username: schema.string({}, [
      rules.minLength(5),
      rules.unique({ table: 'users', column: 'username' }),
      rules.required(),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
      rules.required(),
    ]),
    password: schema.string({}, [
      rules.confirmed(),
      rules.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
      rules.required(),
    ]),
  })

  public messages = {}
}
