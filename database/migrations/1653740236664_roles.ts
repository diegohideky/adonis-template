import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      if (process.env.NODE_ENV === 'test') {
        table.uuid('test_id').notNullable()
      }
      table.uuid('id').primary()
      table.string('name').unique().notNullable()
      table.string('alias').unique().notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
