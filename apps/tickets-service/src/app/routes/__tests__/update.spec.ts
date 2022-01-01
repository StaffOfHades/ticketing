import { Types } from 'mongoose';
import request from 'supertest';

import { TicketModel } from '../../models/ticket';
import { app } from '../../index';
import { client } from '../../nats/client';

describe('PUT /tickets/:id', () => {
  it('returns a 401 error if a user is not authenticated', () => {
    return request(app).put('/tickets/1').send().expect(401);
  });
  it('returns a 400 error if an invalid id is provided', async () => {
    const cookie = await global.signin();
    const response = await request(app).put('/tickets/1').set('Cookie', cookie).send();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      errors: expect.arrayContaining([{ field: 'id', message: 'A valid id must be provided' }]),
    });
  });
  it('returns a 400 error if an invalid title or price are provided', async () => {
    const id = new Types.ObjectId().toHexString();

    const cookie = await global.signin();
    const uri = `/tickets/${id}`;
    const response = await request(app).put(uri).set('Cookie', cookie).send();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: [{ field: 'title' }, { field: 'price' }] });
  });
  it('returns a 404 error if a ticket is not found', async () => {
    const id = new Types.ObjectId().toHexString();

    const cookie = await global.signin();
    const uri = `/tickets/${id}`;
    const response = await request(app)
      .put(uri)
      .set('Cookie', cookie)
      .send({ price: 1.5, title: 'New ticket' });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ errors: [{ field: uri }] });
  });
  it('returns a 401 error if ticket does not belong to the user', async () => {
    const ticketData = { title: 'New ticket', price: 1.2, userId: '1' };
    const newTicket = TicketModel.build(ticketData);
    await newTicket.save();

    const cookie = await global.signin();
    const response = await request(app)
      .put(`/tickets/${newTicket.id}`)
      .set('Cookie', cookie)
      .send({ price: 1.5, title: 'New ticket' });

    expect(response.status).toBe(401);
  });
  it('updates a ticket with valid inputs', async () => {
    const user = { email: 'test@test.com', id: '1' };
    const newTicket = TicketModel.build({ title: 'New ticket', price: 1.2, userId: user.id });
    await newTicket.save();

    const ticketData = { price: 2.0, title: 'Updated ticket' };
    const cookie = await global.signin(user);
    const response = await request(app)
      .put(`/tickets/${newTicket.id}`)
      .set('Cookie', cookie)
      .send(ticketData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(ticketData);
  });
  it('publishes an event with updated values of a ticket', async () => {
    const user = { email: 'test@test.com', id: '1' };
    const newTicket = TicketModel.build({ title: 'New ticket', price: 1.2, userId: user.id });
    await newTicket.save();

    const cookie = await global.signin(user);
    const response = await request(app)
      .put(`/tickets/${newTicket.id}`)
      .set('Cookie', cookie)
      .send({ title: 'Title', price: 10.0 });

    await expect(client.instance.publish).toHaveBeenCalled();
  });
});
