import Route from '@ioc:Adonis/Core/Route'
import Config from '@ioc:Adonis/Core/Config'
import validateBody from 'App/Middleware/ValidateBody'
import validateParams from 'App/Middleware/ValidateParams'
import validateQuery from 'App/Middleware/ValidateQuery'
import CommonParamsIdValidator from 'App/Validators/CommonParamsIdValidator'
import TenantsCreateValidator from 'App/Validators/TenantsCreateValidator'
import TenantsQueryValidator from 'App/Validators/TenantsQueryValidator'
import TenantsUpdateValidator from 'App/Validators/TenantsUpdateValidator'

const v1 = Config.get('app.apiV1')

Route.group(() => {
  Route.get('tenants', 'TenantsController.index').middleware(validateQuery(TenantsQueryValidator))
  Route.post('tenants', 'TenantsController.store')
    .middleware('parseOwnerToBody')
    .middleware(validateBody(TenantsCreateValidator))
  Route.get('tenants/:id', 'TenantsController.show').middleware(
    validateParams(CommonParamsIdValidator)
  )
  Route.put('tenants/:id', 'TenantsController.update')
    .middleware(validateParams(CommonParamsIdValidator))
    .middleware(validateBody(TenantsUpdateValidator))
  Route.delete('tenants/:id', 'TenantsController.destroy').middleware(
    validateParams(CommonParamsIdValidator)
  )
}).prefix(v1)
