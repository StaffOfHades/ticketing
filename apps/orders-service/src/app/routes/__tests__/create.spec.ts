import request from 'supertest';

import { TicketModel } from '../../models/ticket';
import { app } from '../../index';
import { client } from '../../nats/client';

describe('POST /orders', () => {
  it('has a route handler listening to requests', async () => {
    const response = await request(app).post('/orders').send({});

    expect(response.status).not.toBe(404);
  });
  it('returns a 401 error if a user is not authenticated', () => {
    return request(app).post('/orders').send({}).expect(401);
  });
  it('returns an 400 error if an invalid ticket id is provided', async () => {
    const cookie = await global.signin();
    const response = await request(app).post('/orders').set('Cookie', cookie).send();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          field: 'ticketId',
          message: 'TicketId must be provided',
        },
      ],
    });
  });
  it.skip('creates a order with valid inputs', async () => {
    let ticketsCount = await TicketModel.estimatedDocumentCount();
    expect(ticketsCount).toBe(0);

    const cookie = await global.signin();
    const response = await request(app)
      .post('/orders')
      .set('Cookie', cookie)
      .send({ title: 'Title', price: 10.0 });

    ticketsCount = await TicketModel.estimatedDocumentCount();
    expect(ticketsCount).toBe(1);

    const newTicket = await TicketModel.findOne({});

    expect(response.status).toBe(201);
    expect(newTicket).toMatchObject(response.body);
  });
  it.skip('publishes an event of new order created', async () => {
    const cookie = await global.signin();
    const response = await request(app)
      .post('/orders')
      .set('Cookie', cookie)
      .send({ title: 'Title', price: 10.0 });

    await expect(client.instance.publish).toHaveBeenCalled();
  });
});
