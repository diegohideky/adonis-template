import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { TContext } from 'App/Types/Context'

export default class UploadValidator {
  constructor(protected ctx: TContext) {}

  public schema = schema.create({
    images: schema.file(
      {
        size: '5mb',
        extnames: ['jpg', 'pdf', 'png'],
      },
      [rules.required()]
    ),
  })

  public messages = {}
}
