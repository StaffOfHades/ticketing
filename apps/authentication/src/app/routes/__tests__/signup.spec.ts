import request from 'supertest';

import { app } from '../../index'

describe('/users/signup', () => {
  it('returns a 201 on successful signup', () => {
    return request(app)
      .post('/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(201)
  })
  it('returns a 400 with an invalid email', () => {
    return request(app)
      .post('/users/signup')
      .send({
        email: 'this is not an email',
        password: 'password'
      })
      .expect(400)
  })
  it('returns a 400 with an invalid password', () => {
    return request(app)
      .post('/users/signup')
      .send({
        email: 'test@test.com',
        password: '1'
      })
      .expect(400)
  })
  it('returns a 400 with missing parameters', async () => {
    await request(app)
      .post('/users/signup')
      .send({
        email: 'test@test.com',
      })
      .expect(400)

    return request(app)
      .post('/users/signup')
      .send({
        password: 'password'
      })
      .expect(400)
  })
  it('disallows duplicated emails', async () => {
    await request(app)
      .post('/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })

    return request(app)
      .post('/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(400)
  })
  it('sets cookie after successful user creation', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })

    expect(response.get('Set-Cookie')).toBeDefined();
  })
})
