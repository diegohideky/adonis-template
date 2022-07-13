import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users_tenants'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      if (process.env.NODE_ENV === 'test') {
        table.uuid('test_id').notNullable()
      }
      table.uuid('id').primary()
      table.uuid('user_id').unsigned().references('id').inTable('users').notNullable()
      table.uuid('tenant_id').unsigned().references('id').inTable('tenants').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
