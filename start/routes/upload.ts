import Route from '@ioc:Adonis/Core/Route'
import Config from '@ioc:Adonis/Core/Config'
import validateBody from 'App/Middleware/ValidateBody'
import UploadValidator from 'App/Validators/UploadValidator'

const v1 = Config.get('app.apiV1')

Route.group(() => {
  Route.post('upload', 'UploadController.upload').middleware(validateBody(UploadValidator))
}).prefix(v1)
