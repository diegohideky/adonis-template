import { v4 as uuidv4 } from 'uuid'
import Redis from '@ioc:Adonis/Addons/Redis'
import { test } from '@japa/runner'
import User from 'App/Models/User'
import AuthMock from '../mocks/auth.mock'
import UsersMock from '../mocks/users.mock'
import { cleanDB } from '../utils'

const endpoint = '/api/v1/auth'

test.group('POST /auth/signup ', (group) => {
  group.each.setup(cleanDB)

  test('error - when password is not equal to confirm password', async ({ client, assert }) => {
    const testId = uuidv4()
    const data = await AuthMock.mock(testId)
    data.password = 'Test1234!'
    data.password = 'Test1234!!!'

    const response = await client.post(`${endpoint}/signup`).form(data)

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          rule: 'confirmed',
          field: 'password_confirmation',
          message: 'confirmed validation failed',
        },
      ],
    })

    const user = await User.findBy('email', data.email)
    assert.isNull(user)
  })

  test('error - when password does not follow pattern', async ({ client, assert }) => {
    const testId = uuidv4()
    const data = await AuthMock.mock(testId)
    data.password = '1234'
    data.password = '1234'

    const response = await client.post(`${endpoint}/signup`).form(data)

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          rule: 'regex',
          field: 'password',
          message: 'regex validation failed',
        },
      ],
    })

    const user = await User.findBy('email', data.email)
    assert.isNull(user)
  })

  test('successs - should return token for confirmation', async ({ client, assert }) => {
    const testId = uuidv4()
    const data = await AuthMock.mock(testId)

    const response = await client.post(`${endpoint}/signup`).form(data)

    response.assertStatus(200)
    assert.isTrue(typeof response.body().payload === 'string')

    const user = await User.findBy('email', data.email)
    assert.isTrue(typeof user?.id === 'string')
    assert.equal(user?.name, data.name)
    assert.equal(user?.username, data.username)
    assert.equal(user?.email, data.email)
    assert.isFalse(user?.confirmed)
  })
})

test.group('POST /auth/confirm ', (group) => {
  group.each.setup(cleanDB)

  test('error - when token has expired', async ({ client, assert }) => {
    const testId = uuidv4()
    const data = await AuthMock.mock(testId)

    const response = await client.post(`${endpoint}/signup`).form(data)

    response.assertStatus(200)

    let user = await User.findBy('email', data.email)
    assert.isTrue(typeof user?.id === 'string')
    assert.equal(user?.name, data.name)
    assert.equal(user?.username, data.username)
    assert.equal(user?.email, data.email)
    assert.isFalse(user?.confirmed)

    const token = response.body().payload

    // mocking token expiration
    await Redis.del(`auth:token:${token}`)

    const response2 = await client.post(`${endpoint}/confirm`).form({ token })

    response2.assertStatus(404)
    response2.assertBodyContains({ message: 'Token has expired' })

    user = await User.findBy('email', data.email)
    assert.isTrue(typeof user?.id === 'string')
    assert.equal(user?.name, data.name)
    assert.equal(user?.username, data.username)
    assert.equal(user?.email, data.email)
    assert.isFalse(user?.confirmed)
  })

  test('success - when it takes the token and send in confirm', async ({ client, assert }) => {
    const testId = uuidv4()
    const data = await AuthMock.mock(testId)

    const response = await client.post(`${endpoint}/signup`).form(data)

    response.assertStatus(200)

    let user = await User.findBy('email', data.email)
    assert.isTrue(typeof user?.id === 'string')
    assert.equal(user?.name, data.name)
    assert.equal(user?.username, data.username)
    assert.equal(user?.email, data.email)
    assert.isFalse(user?.confirmed)

    const token = response.body().payload
    const response2 = await client.post(`${endpoint}/confirm`).form({ token })

    response2.assertStatus(200)
    response2.assertBody({ payload: true })

    user = await User.findBy('email', data.email)
    assert.isTrue(typeof user?.id === 'string')
    assert.equal(user?.name, data.name)
    assert.equal(user?.username, data.username)
    assert.equal(user?.email, data.email)
    assert.isTrue(user?.confirmed)
  })
})

test.group('POST /auth/resend ', (group) => {
  group.each.setup(cleanDB)

  test('error - when user is already confirmed', async ({ client, assert }) => {
    const testId = uuidv4()
    const data = await UsersMock.mock(testId, { confirmed: true })
    const user = await User.create(data)

    const response = await client.post(`${endpoint}/resend`).form({ email: user.email })

    response.assertStatus(400)
    const { text } = response.error() as { text: string }
    assert.equal(text, 'User already confirmed')
  })

  test('success - when user is still not confirmed', async ({ client, assert }) => {
    const testId = uuidv4()
    const data = await UsersMock.mock(testId)
    const user = await User.create(data)

    const response = await client.post(`${endpoint}/resend`).form({ email: user.email })

    response.assertStatus(200)
    const { payload } = response.body()
    assert.isTrue(typeof payload === 'string')
  })
})

test.group('POST /auth/login ', (group) => {
  group.each.setup(cleanDB)

  test('error - when user is not confirmed', async ({ client, assert }) => {
    const testId = uuidv4()
    const data = await UsersMock.mock(testId)

    const user = await User.create(data)

    const response = await client.post(`${endpoint}/login`).form({
      email: user.email,
      password: data.password,
    })

    response.assertStatus(400)
    const { text } = response.error() as { text: string }
    assert.equal(text, 'User not confirmed. Please check your email')
  })

  test('error - when password is wrong', async ({ client, assert }) => {
    const testId = uuidv4()
    const data = await UsersMock.mock(testId, { confirmed: true })

    const user = await User.create(data)

    const response = await client.post(`${endpoint}/login`).form({
      email: user.email,
      password: 'Test1111!',
    })

    response.assertStatus(400)
    const { text } = response.error() as { text: string }
    assert.equal(text, 'Invalid password')
  })

  test('success - when user is confirmed and password is right should return token', async ({
    client,
    assert,
  }) => {
    const testId = uuidv4()
    const data = await UsersMock.mock(testId, { confirmed: true })

    const user = await User.create(data)
    await user.load('role')

    const response = await client.post(`${endpoint}/login`).form({
      email: user.email,
      password: data.password,
    })

    response.assertStatus(200)
    const { token, user: userResponse } = response.body().payload
    assert.isTrue(typeof token === 'string')
    assert.equal(userResponse.id, user.id)
    assert.equal(userResponse.name, user.name)
    assert.equal(userResponse.username, user.username)
    assert.equal(userResponse.email, user.email)
    assert.equal(userResponse.confirmed, user.confirmed)
    assert.equal(userResponse.role.id, user.role.id)
    assert.equal(userResponse.role.name, user.role.name)
    assert.equal(userResponse.role.alias, user.role.alias)
  })
})

test.group('POST /auth/validate ', (group) => {
  group.each.setup(cleanDB)

  test('error - pass invalid token', async ({ client }) => {
    const response = await client.post(`${endpoint}/validate`).headers({
      Authorization: 'Bearer Test1111!',
    })

    response.assertStatus(401)
  })

  test('success - when pass a valid token', async ({ client }) => {
    const testId = uuidv4()
    const data = await UsersMock.mock(testId, { confirmed: true })

    const user = await User.create(data)
    await user.load('role')

    const response = await client.post(`${endpoint}/login`).form({
      email: user.email,
      password: data.password,
    })

    response.assertStatus(200)
    const token = response.body().payload.token

    const response2 = await client.post(`${endpoint}/validate`).headers({
      Authorization: `Bearer ${token}`,
    })

    response2.assertStatus(200)
    response2.assertBodyContains({
      payload: {
        id: user.id,
        roleId: user.roleId,
        name: user.name,
        username: user.username,
        email: user.email,
        confirmed: user.confirmed,
        createdAt: user.createdAt.toISO().toString(),
        updatedAt: user.updatedAt.toISO().toString(),
        role: {
          id: user.role.id,
          name: user.role.name,
          alias: user.role.alias,
          createdAt: user.role.createdAt.toISO().toString(),
          updatedAt: user.role.updatedAt.toISO().toString(),
        },
      },
    })
  })
})

test.group('POST /auth/logout ', (group) => {
  group.each.setup(cleanDB)

  test('success - when user is logged in', async ({ client }) => {
    const testId = uuidv4()
    const data = await UsersMock.mock(testId, { confirmed: true })

    const user = await User.create(data)

    const response = await client.post(`${endpoint}/login`).form({
      email: user.email,
      password: data.password,
    })

    response.assertStatus(200)
    const token = response.body().payload

    const response2 = await client.post(`${endpoint}/logout`).headers({
      Authorization: `Bearer ${token}`,
    })

    response2.assertStatus(200)
    response2.assertBodyContains({ payload: true })
  })
})
