import { v4 as uuidv4 } from 'uuid'
import faker from 'faker'
import { test } from '@japa/runner'
import User from 'App/Models/User'
import Tenant from 'App/Models/Tenant'
import TenantsMock from '../mocks/tenants.mock'
import { cleanDB, getEndpoint } from '../utils'

const endpoint = '/api/v1/tenants'
test.group('GET /tenants ', (group) => {
  group.each.setup(cleanDB)

  test('error - when query params are wrong', async ({ client }) => {
    const testId = uuidv4()
    const admin = await User.findByOrFail('username', 'administrator')
    const response = await client
      .get(
        getEndpoint(endpoint, {
          page: 'a',
          pageSize: 'a',
          order: 'a',
          direction: 'a',
          testId,
        })
      )
      .loginAs(admin)

    response.assertStatus(400)
    response.assertBodyContains({
      page: ['number validation failed'],
      pageSize: ['number validation failed'],
      order: ['enum validation failed'],
      direction: ['enum validation failed'],
    })
  })

  test('successs - should return list of tenants', async ({ client, assert }) => {
    const testId = uuidv4()
    const data = await TenantsMock.mockMany(testId)
    const tenants = await Tenant.createMany(data)

    const admin = await User.findByOrFail('username', 'administrator')

    const response = await client.get(getEndpoint(endpoint, { testId })).loginAs(admin)

    response.assertStatus(200)
    const { payload } = response.body()
    assert.isTrue(payload.length === tenants.length)

    const tenantsMap = tenants.reduce((acc, tenant) => {
      acc[tenant.id] = tenant
      return acc
    }, {})

    payload.forEach((tenant) => {
      assert.equal(tenant.id, tenantsMap[tenant.id].id)
      assert.equal(tenant.name, tenantsMap[tenant.id].name)
      assert.equal(tenant.ownerId, tenantsMap[tenant.id].ownerId)
      assert.equal(tenant.logo, tenantsMap[tenant.id].logo)
      assert.equal(tenant.createdAt, tenantsMap[tenant.id].createdAt.toISO().toString())
      assert.equal(tenant.updatedAt, tenantsMap[tenant.id].updatedAt.toISO().toString())
    })
  })
})

test.group('GET /tenants:id ', (group) => {
  group.each.setup(cleanDB)

  test('successs - when user is owner should return tenant', async ({ client, assert }) => {
    const testId = uuidv4()

    const owner = await User.findByOrFail('username', 'owner')

    const data = await TenantsMock.mock(testId, { ownerId: owner.id })
    const tenant = await Tenant.create(data)

    const response = await client.get(getEndpoint(`${endpoint}/${tenant.id}`)).loginAs(owner)

    response.assertStatus(200)
    const { payload } = response.body()

    assert.equal(tenant.id, payload.id)
    assert.equal(tenant.name, payload.name)
    assert.equal(tenant.ownerId, payload.ownerId)
    assert.equal(tenant.logo, payload.logo)
    assert.equal(tenant.createdAt.toISO().toString(), payload.createdAt)
    assert.equal(tenant.updatedAt.toISO().toString(), payload.updatedAt)
  })
})

test.group('POST /tenants', (group) => {
  group.each.setup(cleanDB)

  test('error - when body is invalid', async ({ client }) => {
    const owner = await User.findByOrFail('username', 'owner')
    const response = await client
      .post(getEndpoint(`${endpoint}`))
      .loginAs(owner)
      .form({
        name: 'aa',
      })

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [],
    })
  })

  test('error - employee - should not create tenant', async ({ client }) => {
    const employee = await User.findByOrFail('username', 'employee')

    const updateData = {
      name: faker.company.companyName(),
      logo: faker.internet.url(),
      ownerId: employee.id,
      active: true,
    }

    const response = await client
      .post(getEndpoint(`${endpoint}`))
      .loginAs(employee)
      .form(updateData)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action',
    })
  })

  test('successs - admin - should create tenant', async ({ client, assert }) => {
    const testId = uuidv4()

    const data = await TenantsMock.mock(testId)

    const admin = await User.findByOrFail('username', 'administrator')

    const response = await client
      .post(getEndpoint(`${endpoint}`))
      .loginAs(admin)
      .form(data)

    response.assertStatus(200)
    const { payload } = response.body()

    assert.equal(data.name, payload.name)
    assert.equal(data.logo, payload.logo)
    assert.equal(data.ownerId, payload.ownerId)
  })

  test('successs - owner - should create tenant', async ({ client, assert }) => {
    const testId = uuidv4()

    const owner = await User.findByOrFail('username', 'owner')

    const data = await TenantsMock.mock(testId)

    const response = await client
      .post(getEndpoint(`${endpoint}`))
      .loginAs(owner)
      .form(data)

    response.assertStatus(200)
    const { payload } = response.body()

    assert.equal(data.name, payload.name)
    assert.equal(data.logo, payload.logo)
    assert.equal(owner.id, payload.ownerId)
  })
})

test.group('PUT /tenants/:id ', (group) => {
  group.each.setup(cleanDB)

  test('error - when body is invalid', async ({ client }) => {
    const testId = uuidv4()

    const data = await TenantsMock.mock(testId)
    const tenant = await Tenant.create(data)

    const owner = await User.findByOrFail('username', 'owner')
    const response = await client
      .put(getEndpoint(`${endpoint}/${tenant.id}`))
      .loginAs(owner)
      .form({
        name: 'aa',
      })

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          rule: 'required',
          field: 'ownerId',
          message: 'required validation failed',
        },
        {
          rule: 'required',
          field: 'ownerId',
          message: 'required validation failed',
        },
        {
          rule: 'required',
          field: 'logo',
          message: 'required validation failed',
        },
        {
          rule: 'nullable',
          field: 'logo',
          message: 'nullable validation failed',
        },
        {
          rule: 'required',
          field: 'active',
          message: 'required validation failed',
        },
      ],
    })
  })

  test('error - employee - should not update tenant', async ({ client }) => {
    const testId = uuidv4()

    const data = await TenantsMock.mock(testId)
    const tenant = await Tenant.create(data)

    const employee = await User.findByOrFail('username', 'employee')

    const updateData = {
      name: faker.company.companyName(),
      logo: faker.internet.url(),
      ownerId: employee.id,
      active: true,
    }

    const response = await client
      .put(getEndpoint(`${endpoint}/${tenant.id}`))
      .loginAs(employee)
      .form(updateData)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action',
    })
  })

  test('error - owner - when owner is not owner of tenant - should not update tenant', async ({
    client,
  }) => {
    const testId = uuidv4()

    const owner = await User.findByOrFail('username', 'owner')
    const admin = await User.findByOrFail('username', 'administrator')

    const data = await TenantsMock.mock(testId, { ownerId: admin.id })
    const tenant = await Tenant.create(data)

    const updateData = {
      name: faker.company.companyName(),
      logo: faker.internet.url(),
      ownerId: tenant.id,
      active: true,
    }

    const response = await client
      .put(getEndpoint(`${endpoint}/${tenant.id}`))
      .loginAs(owner)
      .form(updateData)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action',
    })
  })

  test('successs - admin - should update tenant', async ({ client, assert }) => {
    const testId = uuidv4()

    const data = await TenantsMock.mock(testId)
    const tenant = await Tenant.create(data)

    const admin = await User.findByOrFail('username', 'administrator')

    const updateData = {
      name: faker.company.companyName(),
      logo: faker.internet.url(),
      ownerId: admin.id,
      active: true,
    }

    const response = await client
      .put(getEndpoint(`${endpoint}/${tenant.id}`))
      .loginAs(admin)
      .form(updateData)

    response.assertStatus(200)
    const { payload } = response.body()

    assert.equal(tenant.id, payload.id)
    assert.equal(updateData.name, payload.name)
    assert.equal(updateData.logo, payload.logo)
    assert.equal(updateData.ownerId, payload.ownerId)
  })

  test('successs - owner - when owner is owner of tenant - should update tenant', async ({
    client,
    assert,
  }) => {
    const testId = uuidv4()

    const owner = await User.findByOrFail('username', 'owner')

    const data = await TenantsMock.mock(testId, { ownerId: owner.id })
    const tenant = await Tenant.create(data)

    const updateData = {
      name: faker.company.companyName(),
      logo: faker.internet.url(),
      ownerId: owner.id,
      active: true,
    }

    const response = await client
      .put(getEndpoint(`${endpoint}/${tenant.id}`))
      .loginAs(owner)
      .form(updateData)

    response.assertStatus(200)
    const { payload } = response.body()

    assert.equal(tenant.id, payload.id)
    assert.equal(updateData.name, payload.name)
    assert.equal(updateData.logo, payload.logo)
    assert.equal(updateData.ownerId, payload.ownerId)
  })
})

test.group('DELETE /tenants:id ', (group) => {
  group.each.setup(cleanDB)

  test('error - when id is invalid', async ({ client }) => {
    const testId = uuidv4()

    const data = await TenantsMock.mock(testId)
    const tenant = await Tenant.create(data)

    const owner = await User.findByOrFail('username', 'owner')
    const response = await client.delete(getEndpoint(`${endpoint}/${tenant.id}aaa`)).loginAs(owner)

    response.assertStatus(400)
    response.assertBodyContains({
      id: ['uuid validation failed'],
    })
  })

  test('error - employee - should not delete tenant', async ({ client }) => {
    const testId = uuidv4()

    const data = await TenantsMock.mock(testId)
    let tenant: Tenant | null = await Tenant.create(data)

    const employee = await User.findByOrFail('username', 'employee')

    const response = await client.delete(getEndpoint(`${endpoint}/${tenant.id}`)).loginAs(employee)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action',
    })
  })

  test('error - owner - when owner is not owner of tenant - should not delete tenant', async ({
    client,
  }) => {
    const testId = uuidv4()

    const owner = await User.findByOrFail('username', 'owner')
    const admin = await User.findByOrFail('username', 'administrator')

    const data = await TenantsMock.mock(testId, { ownerId: admin.id })
    let tenant: Tenant | null = await Tenant.create(data)

    const response = await client.delete(getEndpoint(`${endpoint}/${tenant.id}`)).loginAs(owner)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action',
    })
  })

  test('successs - owner - when owner is owner of tenant - should delete tenant', async ({
    client,
    assert,
  }) => {
    const testId = uuidv4()

    const owner = await User.findByOrFail('username', 'owner')

    const data = await TenantsMock.mock(testId, { ownerId: owner.id })
    let tenant: Tenant | null = await Tenant.create(data)

    const response = await client.delete(getEndpoint(`${endpoint}/${tenant.id}`)).loginAs(owner)

    response.assertStatus(200)
    response.assertBodyContains({ payload: true })

    tenant = await Tenant.findBy('id', tenant.id)
    assert.isNull(tenant)
  })

  test('successs - admin - should delete tenant', async ({ client, assert }) => {
    const testId = uuidv4()

    const data = await TenantsMock.mock(testId)
    let tenant: Tenant | null = await Tenant.create(data)

    const admin = await User.findByOrFail('username', 'administrator')

    const response = await client.delete(getEndpoint(`${endpoint}/${tenant.id}`)).loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains({ payload: true })

    tenant = await Tenant.findBy('id', tenant.id)
    assert.isNull(tenant)
  })
})
