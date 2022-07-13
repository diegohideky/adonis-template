import { schema, rules } from '@ioc:Adonis/Core/Validator'

const CommonQueryStringSchema = {
  ...(process.env.NODE_ENV === 'test' && { testId: schema.string({}, [rules.uuid()]) }),
  page: schema.number([rules.range(1, 100), rules.required()]),
  pageSize: schema.number([rules.range(1, 20), rules.required()]),
  order: schema.enum(['createdAt'], [rules.required()]),
  direction: schema.enum(['asc', 'desc'], [rules.required()]),
}

export default CommonQueryStringSchema
