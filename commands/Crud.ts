import { join } from 'path'
import { args, BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class Crud extends BaseCommand {
  public filesTypes = {
    model: 'model',
    interface: 'interface',
    type: 'type',
    repository: 'repository',
    service: 'service',
    controller: 'controller',
  }

  public validators = {
    create: 'create',
    query: 'query',
    update: 'update',
  }

  /**
   * Command name is used to run the command
   */
  public static commandName = 'crud'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Generates a whole CRUD flow to your new Entity'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  @args.string({ description: 'Name of the Entity for CRUD' })
  public name: string

  @flags.boolean({ alias: 'i', description: 'Enable interactive mode' })
  public interactive: boolean

  public async genereteMock() {
    const name = string.pluralize(string.pascalCase(this.name))
    this.generator
      .addFile(this.name, {
        // force filename to be plural
        form: 'plural',

        // define ".ts" extension when not already defined
        extname: '.mock.ts',

        // re-format the name to "pascalCase"
        pattern: 'camelcase',

        // Do not pluralize when model name matches one of the following
        formIgnoreList: ['Home', 'Auth', 'Login'],
      })
      .appRoot(this.application.appRoot)
      .destinationDir('tests/mocks')
      .useMustache()
      .stub(join(__dirname, './templates/mock.txt'))
      .apply({ name })
  }

  public async genereteE2E() {
    const name = string.pluralize(string.pascalCase(this.name))
    const path = string.pluralize(this.name.toLowerCase())
    const item = string.singularize(this.name.toLowerCase())
    const open = '{'
    const close = '}'

    this.generator
      .addFile(this.name, {
        // force filename to be plural
        form: 'plural',

        // define ".ts" extension when not already defined
        extname: '.spec.ts',

        // re-format the name to "pascalCase"
        pattern: 'camelcase',

        // Do not pluralize when model name matches one of the following
        formIgnoreList: ['Home', 'Auth', 'Login'],
      })
      .appRoot(this.application.appRoot)
      .destinationDir('tests/functional')
      .useMustache()
      .stub(join(__dirname, './templates/e2e.txt'))
      .apply({ name, path, item, open, close })
  }

  public async genereteEnums() {
    const name = string.pluralize(string.pascalCase(this.name))
    const enumName = string.pluralize(this.name.toUpperCase())
    const table = string.pluralize(this.name.toLowerCase())
    this.generator
      .addFile(this.name, {
        // force filename to be plural
        form: 'plural',

        // define ".ts" extension when not already defined
        extname: '.ts',

        // re-format the name to "pascalCase"
        pattern: 'pascalcase',

        // Do not pluralize when model name matches one of the following
        formIgnoreList: ['Home', 'Auth', 'Login'],
      })
      .appRoot(this.application.appRoot)
      .destinationDir('app/Enums')
      .useMustache()
      .stub(join(__dirname, './templates/enum.txt'))
      .apply({ name, enumName, table })
  }

  public async generateMigration() {
    const name = string.pluralize(string.pascalCase(this.name))
    const tableName = string.pluralize(string.snakeCase(this.name.toLowerCase()))
    this.generator
      .addFile(this.name, {
        // force filename to be plural
        form: 'plural',

        // define ".ts" extension when not already defined
        extname: '.ts',

        // re-format the name to "pascalCase"
        pattern: 'snakecase',

        prefix: `${new Date().getTime()}_`,

        // Do not pluralize when model name matches one of the following
        formIgnoreList: ['Home', 'Auth', 'Login'],
      })
      .appRoot(this.application.appRoot)
      .destinationDir('database/migrations')
      .useMustache()
      .stub(join(__dirname, './templates/migration.txt'))
      .apply({ name, tableName })
  }

  public async generateRoute() {
    const name = string.pluralize(string.pascalCase(this.name))
    const route = string.pluralize(string.dashCase(this.name.toLowerCase()))
    this.generator
      .addFile(this.name, {
        // force filename to be plural
        form: 'plural',

        // define ".ts" extension when not already defined
        extname: '.ts',

        // re-format the name to "pascalCase"
        pattern: 'camelcase',

        // Do not pluralize when model name matches one of the following
        formIgnoreList: ['home', 'auth', 'login', 'signup'],
      })
      .appRoot(this.application.appRoot)
      .destinationDir('start/routes')
      .useMustache()
      .stub(join(__dirname, './templates/route.txt'))
      .apply({ name, route })
  }

  public async generateValidators(validatorType) {
    const name = string.pluralize(string.pascalCase(this.name))
    const template = './templates/' + validatorType + 'Validator.txt'

    this.generator
      .addFile(this.name, {
        // force filename to be plural
        form: 'plural',

        // define ".ts" extension when not already defined
        extname: '.ts',

        // re-format the name to "pascalCase"
        pattern: 'pascalcase',

        suffix: string.pascalCase(validatorType) + 'Validator',

        // Do not pluralize when model name matches one of the following
        formIgnoreList: ['Home', 'Auth', 'Login', 'Signup'],
      })
      .appRoot(this.application.appRoot)
      .destinationDir('app/Validators')
      .useMustache()
      .stub(join(__dirname, template))
      .apply({ name })
  }

  public async generateCommon(fileType) {
    const name = string.pluralize(string.pascalCase(this.name))
    const folder = string.pluralize(string.pascalCase(fileType))
    const table = string.pluralize(string.snakeCase(this.name.toLowerCase()))

    let destination = 'app/' + folder
    let template = './templates/' + fileType + '.txt'

    this.generator
      .addFile(this.name, {
        // force filename to be plural
        form: 'plural',

        // define ".ts" extension when not already defined
        extname: '.ts',

        // re-format the name to "pascalCase"
        pattern: 'pascalcase',

        ...(fileType !== this.filesTypes.model && { suffix: string.pascalCase(fileType) }),

        // Do not pluralize when model name matches one of the following
        formIgnoreList: ['Home', 'Auth', 'Login'],
      })
      .appRoot(this.application.appRoot)
      .destinationDir(destination)
      .useMustache()
      .stub(join(__dirname, template))
      .apply({ name, table })
  }

  public async generateFiles(fileType) {
    this.generateCommon(fileType)
  }

  public async run() {
    this.logger.info('Creating CRUD for ' + this.name)

    this.generateMigration()
    this.generateRoute()
    this.genereteEnums()
    this.genereteMock()
    this.genereteE2E()

    await Promise.all(
      Object.values(this.validators).map(async (validatorType) => {
        return this.generateValidators(validatorType)
      })
    )

    await Promise.all(
      Object.values(this.filesTypes).map(async (fileType) => {
        return this.generateFiles(fileType)
      })
    )

    await this.generator.run()
  }
}
