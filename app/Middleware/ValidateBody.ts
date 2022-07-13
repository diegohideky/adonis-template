import type { RouteMiddlewareHandler } from '@ioc:Adonis/Core/Route'
import LoggerService from 'App/Services/LoggerService'
import { TContext } from 'App/Types/Context'

const validateBody = (ValidatorInstance): RouteMiddlewareHandler | RouteMiddlewareHandler[] => {
  // @ts-ignore
  return async (ctx: TContext, next: () => void): Promise<any> => {
    const logger = new LoggerService()
    const location = 'validateBodyMiddleware'

    try {
      logger.info(ctx.logId, location, 'Validating body', { body: ctx.request.body() })
      const payload = await ctx.request.validate(ValidatorInstance)

      ctx.request.updateBody(payload)
      logger.info(ctx.logId, location, 'body is valid', { body: ctx.request.body() })
    } catch (error) {
      logger.error(ctx.logId, location, 'body is invalid', { body: ctx.request.body(), error })
      return ctx.response.badRequest(error.messages)
    }

    await next()
  }
}

export default validateBody
