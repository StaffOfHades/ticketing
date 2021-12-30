import request from 'supertest';

import { app } from '../../index';

describe('/users/signout', () => {
  it('clears the cookie after signing out', async () => {
    const response = await request(app).post('/users/signout').send({});

    expect(response.status).toBe(204);
    expect(response.get('Set-Cookie')).toEqual([
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
    ]);
  });
});
