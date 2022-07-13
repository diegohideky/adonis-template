import Tenant from 'App/Models/Tenant'
import User from 'App/Models/User'
import faker from 'faker'

const mock = async (testId: string, params?: Partial<Tenant>) => {
  const user = !params?.owner ? await User.findBy('username', 'owner') : null

  return {
    name: faker.company.companyName(),
    ownerId: user?.id,
    logo: faker.internet.url(),
    ...params,
    testId,
  }
}

const mockMany = async (testId: string, quantity?: number) => {
  const user = await User.findBy('username', 'owner')

  return Promise.all(
    Array.from({ length: quantity || faker.datatype.number({ min: 1, max: 10 }) }).map(async () =>
      mock(testId, { ownerId: user?.id })
    )
  )
}

const TenantsMock = {
  mock,
  mockMany,
}

export default TenantsMock
