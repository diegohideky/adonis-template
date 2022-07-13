import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { LucidModel, ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { IBaseRepository } from 'App/Interfaces/BaseInterface'

export default class BaseRepository implements IBaseRepository {
  public model: LucidModel

  constructor(model: LucidModel) {
    if (!model) {
      throw new Error('model must be defined')
    }

    this.model = model
  }

  public async findAll(options: any): Promise<ModelObject[]> {
    const { query } = options
    const {
      page,
      pageSize,
      order = 'createdAt',
      direction = 'asc',
      relations = [],
      ...fields
    } = query

    let queryBuilder = this.model.query()

    queryBuilder = queryBuilder.orderBy(order, direction)

    if (fields?.testId) {
      console.log({ testId: fields?.testId })
    }

    Object.entries(fields || {}).forEach(([key, value], index) => {
      queryBuilder =
        index === 0
          ? queryBuilder.where(key, value as string | number)
          : queryBuilder.andWhere(key, value as string | number)
    })

    relations.forEach((relation) => queryBuilder.preload(relation))

    const rows = await queryBuilder.paginate(+page, +pageSize)

    return rows.serialize().data
  }

  public async save(data: ModelObject, trx: TransactionClientContract): Promise<ModelObject> {
    return this.model.create(data, { client: trx })
  }

  public async findById(id: string, relations: string[] = []): Promise<ModelObject> {
    const row: any = await this.model.findByOrFail('id', id)

    await Promise.all(relations.map(async (relation) => row.load(relation)))

    return row
  }

  public async findBy(field: string, value: any, relations: string[] = []): Promise<ModelObject> {
    const row = await this.model.findByOrFail(field, value)

    // @ts-ignore
    await Promise.all(relations.map(async (relation) => row.load(relation)))

    return row
  }

  public async updateById(
    id: string,
    data: ModelObject,
    trx: TransactionClientContract
  ): Promise<ModelObject> {
    await this.findById(id)

    return this.model.updateOrCreate({ id }, data, { client: trx })
  }

  public async deleteById(id: string, trx: TransactionClientContract): Promise<boolean> {
    await this.findById(id)

    const deleted = await trx.from(this.model.table).where('id', id).del()
    return +deleted === 1
  }
}
