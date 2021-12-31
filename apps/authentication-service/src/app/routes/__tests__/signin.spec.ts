import request from 'supertest';

import { UserModel } from '../../models/user';
import { app } from '../../index';

describe('POST /users/signin', () => {
  const userLogin = { email: 'test@test.com', password: 'password' };
  it('returns a 400 when email does not exist on database', () => {
    return request(app)
      .post('/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });
  it('returns a 400 when an incorrect password for an account is supplied', async () => {
    const newUser = UserModel.build(userLogin);
    await newUser.save();

    await request(app)
      .post('/users/signin')
      .send({ ...userLogin, password: '123456' })
      .expect(400);
  });
  it('sets cookie after successful login', async () => {
    const newUser = UserModel.build(userLogin);
    await newUser.save();

    const response = await request(app).post('/users/signin').send(userLogin);

    expect(response.status).toBe(200);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
