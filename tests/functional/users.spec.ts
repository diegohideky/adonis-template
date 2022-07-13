import { v4 as uuidv4 } from 'uuid'
import faker from 'faker'
import { test } from '@japa/runner'
import User from 'App/Models/User'
import UsersMock from '../mocks/users.mock'
import { cleanDB, getEndpoint } from '../utils'

// testing

const endpoint = '/api/v1/users'
test.group('GET /users ', (group) => {
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

  test('successs - should return list of users', async ({ client, assert }) => {
    const testId = uuidv4()
    const data = await UsersMock.mockMany(testId)
    const users = await User.createMany(data)

    const admin = await User.findByOrFail('username', 'administrator')

    const response = await client.get(getEndpoint(endpoint, { testId })).loginAs(admin)

    response.assertStatus(200)
    const { payload } = response.body()
    assert.isTrue(payload.length === users.length)

    const usersMap = users.reduce((acc, user) => {
      acc[user.id] = user
      return acc
    }, {})

    payload.forEach((user) => {
      assert.equal(user.id, usersMap[user.id].id)
      assert.equal(user.email, usersMap[user.id].email)
      assert.equal(user.name, usersMap[user.id].name)
      assert.equal(user.username, usersMap[user.id].username)
      assert.equal(user.createdAt, usersMap[user.id].createdAt.toISO().toString())
      assert.equal(user.updatedAt, usersMap[user.id].updatedAt.toISO().toString())
    })
  })
})

test.group('GET /users:id ', (group) => {
  group.each.setup(cleanDB)

  test('error - when user is employee', async ({ client }) => {
    const testId = uuidv4()

    const data = await UsersMock.mock(testId)
    const user = await User.create(data)

    const employee = await User.findByOrFail('username', 'employee')
    const response = await client.get(getEndpoint(`${endpoint}/${user.id}`)).loginAs(employee)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action',
    })
  })

  test('error - employee - should not allow creation of user', async ({ client }) => {
    const testId = uuidv4()

    const data = await UsersMock.mock(testId)
    const user = await User.create(data)

    const employee = await User.findByOrFail('username', 'employee')
    const response = await client.get(getEndpoint(`${endpoint}/${user.id}`)).loginAs(employee)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action',
    })
  })

  test('successs - owner - should return tenant', async ({ client, assert }) => {
    const testId = uuidv4()

    const data = await UsersMock.mock(testId)
    const user = await User.create(data)

    const owner = await User.findByOrFail('username', 'owner')
    const response = await client.get(getEndpoint(`${endpoint}/${user.id}`)).loginAs(owner)

    response.assertStatus(200)
    const { payload } = response.body()

    assert.equal(user.id, payload.id)
    assert.equal(user.email, payload.email)
    assert.equal(user.name, payload.name)
    assert.equal(user.username, payload.username)
    assert.equal(user.createdAt.toISO().toString(), payload.createdAt)
    assert.equal(user.updatedAt.toISO().toString(), payload.updatedAt)
  })

  test('successs - admin - should return user', async ({ client, assert }) => {
    const testId = uuidv4()

    const data = await UsersMock.mock(testId)
    const user = await User.create(data)

    const admin = await User.findByOrFail('username', 'administrator')
    const response = await client.get(getEndpoint(`${endpoint}/${user.id}`)).loginAs(admin)

    response.assertStatus(200)
    const { payload } = response.body()

    assert.equal(user.id, payload.id)
    assert.equal(user.email, payload.email)
    assert.equal(user.name, payload.name)
    assert.equal(user.username, payload.username)
    assert.equal(user.createdAt.toISO().toString(), payload.createdAt)
    assert.equal(user.updatedAt.toISO().toString(), payload.updatedAt)
  })
})

test.group('PUT /user:id ', (group) => {
  group.each.setup(cleanDB)

  test('error - when body is invalid', async ({ client }) => {
    const testId = uuidv4()

    const data = await UsersMock.mock(testId)
    const user = await User.create(data)

    const owner = await User.findByOrFail('username', 'owner')
    const response = await client
      .put(getEndpoint(`${endpoint}/${user.id}`))
      .loginAs(owner)
      .form({
        name: 'aa',
      })

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          rule: 'minLength',
          field: 'name',
          message: 'minLength validation failed',
          args: {
            minLength: 5,
          },
        },
        {
          rule: 'required',
          field: 'username',
          message: 'required validation failed',
        },
        {
          rule: 'required',
          field: 'email',
          message: 'required validation failed',
        },
      ],
    })
  })

  test('successs - should update user', async ({ client, assert }) => {
    const testId = uuidv4()

    const data = await UsersMock.mock(testId)
    const user = await User.create(data)

    const owner = await User.findByOrFail('username', 'owner')

    const updateData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
    }

    const response = await client
      .put(getEndpoint(`${endpoint}/${user.id}`))
      .loginAs(owner)
      .form(updateData)

    response.assertStatus(200)
    const { payload } = response.body()

    assert.equal(user.id, payload.id)
    assert.equal(updateData.email, payload.email)
    assert.equal(updateData.name, payload.name)
    assert.equal(updateData.username, payload.username)
  })
})

test.group('DELETE /users:id ', (group) => {
  group.each.setup(cleanDB)

  test('error - when id is invalid', async ({ client }) => {
    const testId = uuidv4()

    const data = await UsersMock.mock(testId)
    const user = await User.create(data)

    const owner = await User.findByOrFail('username', 'owner')
    const response = await client.delete(getEndpoint(`${endpoint}/${user.id}aaa`)).loginAs(owner)

    response.assertStatus(400)
    response.assertBodyContains({
      id: ['uuid validation failed'],
    })
  })

  test('successs - should delete user', async ({ client, assert }) => {
    const testId = uuidv4()

    const data = await UsersMock.mock(testId)
    let user: User | null = await User.create(data)

    const owner = await User.findByOrFail('username', 'owner')

    const response = await client.delete(getEndpoint(`${endpoint}/${user.id}`)).loginAs(owner)

    response.assertStatus(200)
    response.assertBodyContains({ payload: true })

    user = await User.findBy('id', user.id)
    assert.isNull(user)
  })
})
