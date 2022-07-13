import { RolesAliases } from 'App/Enums/Roles'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import faker from 'faker'

const mock = async (testId: string, params?: Partial<User>) => {
  const role = !params?.roleId ? await Role.findBy('alias', RolesAliases.OWNER) : null

  return {
    name: faker.name.findName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: 'Test1234!',
    roleId: role?.id,
    ...params,
    testId,
  }
}

const mockMany = async (testId: string, quantity?: number) => {
  const role = await Role.findBy('alias', RolesAliases.OWNER)

  return Promise.all(
    Array.from({ length: quantity || faker.datatype.number({ min: 1, max: 10 }) }).map(async () =>
      mock(testId, { roleId: role?.id })
    )
  )
}

const UsersMock = {
  mock,
  mockMany,
}

export default UsersMock
