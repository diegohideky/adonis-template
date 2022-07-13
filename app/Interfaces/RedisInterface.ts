export interface IRedisService {
  set(key: string, data: object, ttl?: number): Promise<string>
  get(key: string): Promise<any>
  getKeysByPrefix(prefix: string): Promise<string[]>
  del(key: string): Promise<number>
  delAllByPrefix(prefixKey: string): Promise<number[]>
}
