import Redis from '@ioc:Adonis/Addons/Redis'
import Config from '@ioc:Adonis/Core/Config'
import { IRedisService } from 'App/Interfaces/RedisInterface'

export default class RedisService implements IRedisService {
  public ttl = 86400000 // 1 day
  private redisEnabled = Config.get('app.redisEnabled')

  constructor(ttl?: number) {
    if (ttl) {
      this.ttl
    }
  }

  public async set(key: string, data: object, ttl: number): Promise<any> {
    if (!this.redisEnabled) {
      return null
    }

    const ok = await Redis.set(key, JSON.stringify(data), 'EX', ttl || this.ttl)
    if (ok !== 'OK') {
      throw new Error('Could not save on redis')
    }
    return ok
  }

  public async get(key: string): Promise<object | null> {
    if (!this.redisEnabled) {
      return null
    }

    const value = await Redis.get(key)
    return value ? JSON.parse(value) : value
  }

  public async getKeysByPrefix(prefix: string): Promise<string[]> {
    if (!this.redisEnabled) {
      return []
    }

    return Redis.keys(`${prefix}*`)
  }

  public async del(key: string): Promise<number> {
    if (!this.redisEnabled) {
      return 0
    }

    return Redis.hdel(key)
  }

  public async delAllByPrefix(prefixKey: string): Promise<number[]> {
    if (!this.redisEnabled) {
      return []
    }

    const keys = await this.getKeysByPrefix(prefixKey)
    const allDeleted = await Promise.all(keys.map(async (key) => Redis.del(key)))
    return allDeleted
  }
}
