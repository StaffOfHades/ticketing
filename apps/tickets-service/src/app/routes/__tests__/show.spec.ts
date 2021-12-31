import { Types } from 'mongoose';
import request from 'supertest';

import { TicketModel } from '../../models/ticket';
import { app } from '../../index';

describe('GET /tickets/:id', () => {
  it('returns a 401 error if a user is not authenticated', () => {
    return request(app).get('/tickets/1').send().expect(401);
  });
  it('returns a 400 error if an invalid id is provided', async () => {
    const cookie = await global.signin();
    const response = await request(app).get('/tickets/1').set('Cookie', cookie).send();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      errors: [{ field: 'id', message: 'A valid id must be provided' }],
    });
  });
  it('returns a 404 error if a ticket is not found', async () => {
    const id = new Types.ObjectId().toHexString();

    const cookie = await global.signin();
    const uri = `/tickets/${id}`;
    const response = await request(app).get(uri).set('Cookie', cookie).send();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ errors: [{ field: uri }] });
  });
  it('returns ticket if found', async () => {
    const user = { email: 'test@test.com', id: '1' };
    const ticketData = { price: 1.2, title: 'New ticket', userId: user.id };
    const newTicket = TicketModel.build(ticketData);
    await newTicket.save();

    const cookie = await global.signin(user);
    const response = await request(app)
      .get(`/tickets/${newTicket.id}`)
      .set('Cookie', cookie)
      .send();

    expect(response.status).toBe(200);
    expect(newTicket).toMatchObject(response.body);
  });
});
