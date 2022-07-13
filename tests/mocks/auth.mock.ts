import { TSignupParams } from 'App/Types/Auth'
import UsersMock from './users.mock'

const mock = async (testId: string, params?: TSignupParams) => {
  const userParams = await UsersMock.mock(testId)
  delete userParams.roleId
  return {
    ...userParams,
    password_confirmation: userParams.password,
    ...params,
  }
}

const AuthMock = {
  mock,
}

export default AuthMock
