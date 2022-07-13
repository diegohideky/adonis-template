import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      if (process.env.NODE_ENV === 'test') {
        table.uuid('test_id').notNullable()
      }
      table.uuid('id').primary()
      table.uuid('role_id').unsigned().references('id').inTable('roles').notNullable()
      table.string('name').notNullable()
      table.string('username').unique().notNullable()
      table.string('email').unique().notNullable()
      table.string('password').notNullable()
      table.boolean('confirmed').defaultTo(false)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
