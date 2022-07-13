import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { IBaseService, IBaseRepository } from 'App/Interfaces/BaseInterface'
import { IRedisService } from 'App/Interfaces/RedisInterface'
import RedisService from './RedisService'

export default class BaseService implements IBaseService {
  public repository: IBaseRepository
  public cachePrefix: string
  public redisService: IRedisService

  constructor(repository: IBaseRepository, cachePrefix: string) {
    if (!repository) {
      throw new Error('respository must be defined')
    }

    if (!cachePrefix) {
      throw new Error('cachePrefix must be defined')
    }

    this.repository = repository
    this.cachePrefix = cachePrefix
    this.redisService = new RedisService(60000) // 1 minute in miliseconds
  }

  public async findAll(options: any): Promise<ModelObject[]> {
    const cacheKey = `${this.cachePrefix}:findAll:${JSON.stringify(options)}`
    const cachedData = await this.redisService.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const items = await this.repository.findAll(options)
    await this.redisService.set(cacheKey, items)

    return items
  }

  public async save(data: ModelObject, trx: TransactionClientContract): Promise<ModelObject> {
    const item = await this.repository.save(data, trx)
    await this.deleteAllCache()

    return item
  }

  public async findById(id: string): Promise<ModelObject> {
    const cacheKey = `${this.cachePrefix}:findById:${id}`
    const cachedData = await this.redisService.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const item = await this.repository.findById(id)
    await this.redisService.set(cacheKey, item)

    return item
  }

  public async findBy(field: string, value: string): Promise<ModelObject> {
    const cacheKey = `${this.cachePrefix}:findBy:${field}:${value}`
    const cachedData = await this.redisService.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const item = await this.repository.findBy(field, value)
    await this.redisService.set(cacheKey, item)

    return item
  }

  public async updateById(
    id: string,
    data: ModelObject,
    trx: TransactionClientContract
  ): Promise<ModelObject> {
    const item = await this.repository.updateById(id, data, trx)
    await this.deleteAllCache()

    return item
  }

  public async deleteById(id, trx: TransactionClientContract): Promise<boolean> {
    const deleted = await this.repository.deleteById(id, trx)
    await this.deleteAllCache()
    return deleted
  }

  public async deleteAllCache(): Promise<void> {
    await Promise.all([
      this.redisService.delAllByPrefix(`${this.cachePrefix}:findAll:`),
      this.redisService.delAllByPrefix(`${this.cachePrefix}:findById:`),
    ])
  }
}
