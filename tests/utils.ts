import qs from 'qs'
import Redis from '@ioc:Adonis/Addons/Redis'
import Database from '@ioc:Adonis/Lucid/Database'

export const cleanDB = async () => {
  await Redis.flushdb()
  await Database.beginGlobalTransaction()
  return async () => {
    await Database.rollbackGlobalTransaction()
    await Redis.flushdb()
  }
}

export const getQueryString = (params?: Object) =>
  qs.stringify({
    page: 1,
    pageSize: 10,
    order: 'createdAt',
    direction: 'asc',
    ...params,
  })

export const getEndpoint = (path: string, params?: Object) => `${path}?${getQueryString(params)}`
