import Route from '@ioc:Adonis/Core/Route'
import Config from '@ioc:Adonis/Core/Config'
import validateBody from 'App/Middleware/ValidateBody'
import SignupCreateValidator from 'App/Validators/SignupCreateValidator'
import LoginValidator from 'App/Validators/LoginValidator'
import ConfirmValidator from 'App/Validators/ConfirmValidator'
import ResendValidator from 'App/Validators/ResendValidator'

const v1 = Config.get('app.apiV1')

Route.group(() => {
  Route.post('signup', 'AuthController.signup').middleware(validateBody(SignupCreateValidator))
  Route.post('login', 'AuthController.login').middleware(validateBody(LoginValidator))
  Route.post('confirm', 'AuthController.confirm').middleware(validateBody(ConfirmValidator))
  Route.post('resend', 'AuthController.resend').middleware(validateBody(ResendValidator))
  Route.post('validate', 'AuthController.validate')
  Route.post('logout', 'AuthController.logout')
}).prefix(v1 + '/auth')
