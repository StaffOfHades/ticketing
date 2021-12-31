import request from 'supertest';

import { app } from '../../index';

describe('GET /users/current-user', () => {
  it('returns with current user if authenticated', async () => {
    const user = { email: 'test@test.com', id: '1' };
    const cookie = await global.signin(user);

    const response = await request(app).get('/users/current-user').set('Cookie', cookie).send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ currentUser: user });
  });
  it('returns null if not authenticated', async () => {
    const response = await request(app).get('/users/current-user').send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ currentUser: null });
  });
});
