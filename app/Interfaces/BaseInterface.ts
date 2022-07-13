import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { TContext } from 'App/Types/Context'

export interface IBaseController {
  index(ctx: TContext)
  store(ctx: TContext)
  show(ctx: TContext)
  update(ctx: TContext)
  destroy(ctx: TContext)
}

export interface IBaseRepository {
  [x: string]: any
  findAll(options: any): Promise<ModelObject[]>
  save(data: Record<string, any>, trx: TransactionClientContract): Promise<ModelObject>
  findById(id: string, relations?: string[]): Promise<ModelObject>
  findBy(field: string, value: any): Promise<ModelObject>
  updateById(
    id: string,
    data: Record<string, any>,
    trx: TransactionClientContract
  ): Promise<ModelObject>
  deleteById(id: string, trx: TransactionClientContract): Promise<boolean>
}

export interface IBaseService {
  [x: string]: any
  findAll(options: any): Promise<ModelObject[]>
  save(data: Record<string, any>, trx: TransactionClientContract): Promise<ModelObject>
  findById(id: string): Promise<ModelObject>
  findBy(field: string, value: any): Promise<ModelObject>
  updateById(
    id: string,
    data: Record<string, any>,
    trx: TransactionClientContract
  ): Promise<ModelObject>
  deleteById(id: string, trx: TransactionClientContract): Promise<boolean>
}
