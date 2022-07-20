import app from '../api/controllers/users.js'
import request from 'supertest'

describe('Home', () => {

  test('Root url should respond with a 200 status code', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
  })

})

describe('Account', () => {

  describe('Register', () => {

    test('Register user should respond with a 201 status code', async () => {
      const response = await request(app).post('/sign-up')
        .send({
          name: 'Alberto',
          email: 'alberto.sandoval@sspo.gob.mx',
          phone: '9511231231',
          app: '911',
          password: 'OnePasswordForExample'
        })
      expect(response.statusCode).toBe(201)
    })

    test('Register user with same data should respond with a 400 status code', async () => {
      const response = await request(app).post('/sign-up')
        .send({
          name: 'Alberto',
          email: 'alberto.sandoval@sspo.gob.mx',
          phone: '9511231231',
          app: '911',
          password: 'OnePasswordForExample'
        })
      expect(response.statusCode).toBe(400)
    })

    test('Register user should respond with a 400 status code', async () => {
      const response = await request(app).post('/sign-up')
        .send({
          name: 'Alberto',
          email: 'alberto.mendoza@sspo.gob.mx',
          phone: '9511967667',
        })
      expect(response.statusCode).toBe(400)
    })

  })

  describe('App association', () => {

    test('Association without account should respond with a 400 status code', async () => {
      const response = await request(app).put('/sign-up')
        .send({
          email: 'algunotrocorreonoexistente@local.host',
          phone: '9511967667',
          app: '089'
        })
      expect(response.statusCode).toBe(400)
    })

    test('Association with same account should respond with a 400 status code', async () => {
      const response = await request(app).put('/sign-up')
        .send({
          email: 'alberto.mendoza@sspo.gob.mx',
          phone: '9511967667',
          app: '089'
        })
      expect(response.statusCode).toBe(400)
    })

    test('Association without email should respond with a 400 status code', async () => {
      const response = await request(app).put('/sign-up')
        .send({
          phone: '9511967667',
          app: '089'
        })
      expect(response.statusCode).toBe(400)
    })

    test('Association without data should respond with a 400 status code', async () => {
      const response = await request(app).put('/sign-up')
      expect(response.statusCode).toBe(400)
    })

    test('Association with account should respond with a 201 status code', async () => {
      const response = await request(app).put('/sign-up')
        .send({
          app: '089',
          email: 'alberto.sandoval@sspo.gob.mx',
          phone: '9511231231',
        })
      expect(response.statusCode).toBe(201)
    })

  })

  describe('Update', () => {

    test('Update user data should respond with a 200 status code', async () => {
      const response = await request(app).post('/update-account')
        .set({ Authorization: 'the.powerfull.token.is.here' })
        .send({
          name: 'Alberto'
        })
      expect(response.statusCode).toBe(200)
    })

    test('Update user data should respond with a 400 status code', async () => {
      const response = await request(app).post('/update-account')
        .set({ Authorization: 'the.powerfull.token.is.here' })
      expect(response.statusCode).toBe(400)
    })

    test('Update user data should respond with a 401 status code', async () => {
      const response = await request(app).post('/update-account')
        .send({
          name: 'Alberto'
        })
      expect(response.statusCode).toBe(401)
    })

  })

  describe('Validation', () => {
    test('Validate account should respond with a 200 status code', async () => {
      const response = await request(app).get('/validate')
        .send({
          code: 'a-string-wit-valid-code-for-activation'
        })
      expect(response.statusCode).toBe(200)
    })

    test('Validate account with another code should respond with a 400 status code', async () => {
      const response = await request(app).get('/validate')
        .send({
          code: 'a-string-wit-valid-code-for-activation2'
        })
      expect(response.statusCode).toBe(400)
    })

    test('Validate account without code should respond with a 400 status code', async () => {
      const response = await request(app).get('/validate')
      expect(response.statusCode).toBe(400)
    })
  })

  describe('Delete', () => {
    test('Delete account should return 200 status code', async () => {
      const response = await request(app).delete('/delete-my-account')
        .set({ Authorization: 'the.powerfull.token.is.here' })
      expect(response.statusCode).toBe(200)
    })

    test('Delete account with expired jwt should return 401 status code', async () => {
      const response = await request(app).delete('/delete-my-account')
        .set({ Authorization: 'the.powerfull.token.expired.is.here' })
      expect(response.statusCode).toBe(401)
    })

    test('Delete account without jwt should return 401 status code', async () => {
      const response = await request(app).delete('/delete-my-account')
      expect(response.statusCode).toBe(401)
    })
  })

})

describe('Login', () => {

  test('Login with trust data should return a 200 status code', async () => {
    const response = await request(app).post('/log-in')
      .send({
        phone: '9511967667',
        password: 'OnePasswordForExample'
      })
    expect(response.statusCode).toBe(200)
  })

  test('Login without data should return a 400 status code', async () => {
    const response = await request(app).post('/log-in')
    expect(response.statusCode).toBe(400)
  })

  test('Login with wrong data should return a 401 status code', async () => {
    const response = await request(app).post('/log-in')
      .send({
        phone: '951196766',
        password: 'OnePasswordForExample'
      })
    expect(response.statusCode).toBe(401)
  })

})

describe('Verify JWT', () => {

  test('Request with jwt on header should return a 200 status code', async () => {
    const response = await request(app).get('/verify')
      .set({ Authorization: 'the.powerfull.token.is.here' })
    expect(response.statusCode).toBe(200)
  })

  test('Request without jwt should return a 400 status code', async () => {
    const response = await request(app).get('/verify')
    expect(response.statusCode).toBe(400)
  })

  test('Request with wrong jwt on header should return a 401 status code', async () => {
    const response = await request(app).get('/verify')
      .set({ Authorization: 'the.magical.token.is.here' })
    expect(response.statusCode).toBe(401)
  })

})