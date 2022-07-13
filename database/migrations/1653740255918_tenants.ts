import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tenants'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      if (process.env.NODE_ENV === 'test') {
        table.uuid('test_id').notNullable()
      }
      table.uuid('id').primary()
      table.uuid('owner_id').unsigned().references('id').inTable('users').notNullable()
      table.string('name').unique().notNullable()
      table.string('logo')
      table.boolean('active').defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
