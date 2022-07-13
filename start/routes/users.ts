import Route from '@ioc:Adonis/Core/Route'
import Config from '@ioc:Adonis/Core/Config'
import validateBody from 'App/Middleware/ValidateBody'
import validateParams from 'App/Middleware/ValidateParams'
import validateQuery from 'App/Middleware/ValidateQuery'
import CommonParamsIdValidator from 'App/Validators/CommonParamsIdValidator'
import UsersQueryValidator from 'App/Validators/UsersQueryValidator'
import UsersUpdateValidator from 'App/Validators/UsersUpdateValidator'

const v1 = Config.get('app.apiV1')

Route.group(() => {
  Route.get('users', 'UsersController.index').middleware(validateQuery(UsersQueryValidator))
  Route.get('users/:id', 'UsersController.show').middleware(validateParams(CommonParamsIdValidator))
  Route.put('users/:id', 'UsersController.update')
    .middleware(validateParams(CommonParamsIdValidator))
    .middleware(validateBody(UsersUpdateValidator))
  Route.delete('users/:id', 'UsersController.destroy').middleware(
    validateParams(CommonParamsIdValidator)
  )
}).prefix(v1)
