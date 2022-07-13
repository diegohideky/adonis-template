import { TContext } from 'App/Types/Context'
import { v4 as uuidv4 } from 'uuid'

export default class Logger {
  public async handle(ctx: TContext, next: () => Promise<void>) {
    ctx.logId = uuidv4()
    await next()
  }
}
