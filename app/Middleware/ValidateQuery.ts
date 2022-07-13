import type { RouteMiddlewareHandler } from '@ioc:Adonis/Core/Route'
import { validator } from '@ioc:Adonis/Core/Validator'
import LoggerService from 'App/Services/LoggerService'
import { TContext } from 'App/Types/Context'

const validateQuery = (ValidatorInstance): RouteMiddlewareHandler | RouteMiddlewareHandler[] => {
  // @ts-ignore
  return async (ctx: TContext, next: () => void): Promise<any> => {
    const logger = new LoggerService()
    const location = 'validateParamsMiddleware'
    const Validator = new ValidatorInstance()
    const queryString = ctx.request.qs()

    try {
      logger.info(ctx.logId, location, 'Validating queryString', { queryString: ctx.request.qs() })
      const payload = await validator.validate({ schema: Validator.schema, data: queryString })

      ctx.request.updateQs(payload)
      logger.info(ctx.logId, location, 'queryString is valid', { queryString: ctx.request.qs() })
    } catch (error) {
      logger.error(ctx.logId, location, 'queryString is invalid', {
        queryString: ctx.request.qs(),
        error,
      })
      return ctx.response.badRequest(error.messages)
    }

    await next()
  }
}

export default validateQuery
