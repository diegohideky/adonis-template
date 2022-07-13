import Logger from '@ioc:Adonis/Core/Logger'
import { DateTime } from 'luxon'

export default class LoggerService {
  public info(logId: string, location: string, message: string, payload: any): void {
    if (process.env.NODE_ENV === 'test') return
    Logger.info(
      {
        ...payload,
        logId,
        datetime: DateTime.now().toUTC().toISO().toString(),
      },
      `[${logId}][${location}] - ${message}`
    )
  }

  public error(logId: string, location: string, message: string, payload: any): void {
    if (process.env.NODE_ENV === 'test') return
    Logger.error(
      {
        ...payload,
        logId,
        datetime: DateTime.now().toUTC().toISO().toString(),
      },
      `[${logId}][${location}] - ${message}`
    )
  }

  public warn(logId: string, location: string, message: string, payload: any): void {
    if (process.env.NODE_ENV === 'test') return
    Logger.warn(
      {
        ...payload,
        logId,
        datetime: DateTime.now().toUTC().toISO().toString(),
      },
      `[${logId}][${location}] - ${message}`
    )
  }
}
