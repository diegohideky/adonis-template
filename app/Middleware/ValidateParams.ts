import type { RouteMiddlewareHandler } from '@ioc:Adonis/Core/Route'
import { validator } from '@ioc:Adonis/Core/Validator'
import LoggerService from 'App/Services/LoggerService'
import { TContext } from 'App/Types/Context'

const validateParams = (ValidatorInstance): RouteMiddlewareHandler | RouteMiddlewareHandler[] => {
  // @ts-ignore
  return async (ctx: TContext, next: () => void): Promise<any> => {
    const logger = new LoggerService()
    const location = 'validateParamsMiddleware'
    const Validator = new ValidatorInstance()

    try {
      logger.info(ctx.logId, location, 'Validating params', { params: ctx.request.params() })
      const payload = await validator.validate({
        schema: Validator.schema,
        data: ctx.request.params(),
      })

      ctx.request.updateParams(payload)
      logger.info(ctx.logId, location, 'params is valid', { params: ctx.request.params() })
    } catch (error) {
      logger.error(ctx.logId, location, 'Body is invalid', { params: ctx.request.params(), error })
      return ctx.response.badRequest(error.messages)
    }

    await next()
  }
}

export default validateParams
