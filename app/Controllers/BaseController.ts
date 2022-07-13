import Database from '@ioc:Adonis/Lucid/Database'
import { IBaseController, IBaseService } from 'App/Interfaces/BaseInterface'
import LoggerService from 'App/Services/LoggerService'
import { LoggerInterface } from 'App/Interfaces/LoggerInterface'
import { TContext } from 'App/Types/Context'

export default class BaseController implements IBaseController {
  public location: string
  public logger: LoggerInterface
  public service: IBaseService

  constructor(service: IBaseService, location: string) {
    this.service = service
    this.logger = new LoggerService()
    this.location = location
  }

  public async index({ request, response, logId }: TContext) {
    try {
      const query = request.qs()
      const options = { query }

      this.logger.info(logId, this.location, 'Finding items', { options })
      const items = await this.service.findAll(options)
      this.logger.info(logId, this.location, 'Found items', { items })

      response.ok({ payload: items })
    } catch (error) {
      this.logger.error(logId, this.location, 'Error on index', { error })
      response.internalServerError(error.message)
    }
  }

  public async store({ request, response, logId }: TContext) {
    const trx = await Database.transaction()
    const body = request.body()

    try {
      this.logger.info(logId, this.location, 'Creating data', { body })
      const item = await this.service.save(body, trx)

      this.logger.info(logId, this.location, 'Commiting creation on data', { item })
      await trx.commit()
      this.logger.info(logId, this.location, 'Committed creation on data', { item })

      response.ok({ payload: item })
    } catch (error) {
      this.logger.error(logId, this.location, 'Rolling back on store', { error, body })
      await trx.rollback()
      this.logger.error(logId, this.location, 'Rolled back on store', { error, body })
      response.internalServerError(error.message)
    }
  }

  public async show({ params, response, logId }: TContext) {
    const { id } = params

    try {
      this.logger.info(logId, this.location, `Finding by id ${id} `, { id })
      const item = await this.service.findById(id)
      this.logger.info(logId, this.location, `Found by id ${id} `, { item })

      response.ok({ payload: item })
    } catch (error) {
      this.logger.error(logId, this.location, 'Error on show', { error })
      response.internalServerError(error.message)
    }
  }

  public async update({ request, params, response, logId }: TContext) {
    const trx = await Database.transaction()
    const { id } = params
    const body = request.body()

    try {
      this.logger.info(logId, this.location, `Updating by id ${id} `, { id, body })
      const item = await this.service.updateById(params.id, request.body(), trx)
      this.logger.info(logId, this.location, `Commiting update on id ${id} `, { id, item })
      await trx.commit()
      this.logger.info(logId, this.location, `Commited update on id ${id} `, { id, item })

      response.ok({ payload: item })
    } catch (error) {
      this.logger.error(logId, this.location, 'Rolling back on update', { error, id, body })
      await trx.rollback()
      this.logger.error(logId, this.location, 'Rolled back on update', { error, id, body })
      response.internalServerError(error.message)
    }
  }

  public async destroy({ params, response, logId }: TContext) {
    const trx = await Database.transaction()
    const { id } = params

    try {
      this.logger.info(logId, this.location, `Deliting id ${id} `, { id })
      const isDeleted = await this.service.deleteById(params.id, trx)
      this.logger.info(logId, this.location, `Commiting deletion on id ${id} `, { id })
      await trx.commit()
      this.logger.info(logId, this.location, `Commited deletion on id ${id} `, { id })

      response.ok({ payload: isDeleted })
    } catch (error) {
      this.logger.error(logId, this.location, 'Rolling back on destroy', { error, id })
      await trx.rollback()
      this.logger.error(logId, this.location, 'Rolled back on destroy', { error, id })
      response.internalServerError(error.message)
    }
  }
}
