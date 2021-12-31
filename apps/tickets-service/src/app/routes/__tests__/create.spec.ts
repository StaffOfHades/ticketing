import request from 'supertest';

import { TicketModel } from '../../models/ticket';
import { app } from '../../index';

describe('POST /tickets', () => {
  it('has a route handler listening to requests', async () => {
    const response = await request(app).post('/tickets').send({});

    expect(response.status).not.toBe(404);
  });
  it('returns a 401 error if a user is not authenticated', () => {
    return request(app).post('/tickets').send({}).expect(401);
  });
  it('returns an 400 error if an invalid title is provided', async () => {
    const cookie = await global.signin();
    const response = await request(app).post('/tickets').set('Cookie', cookie).send({});

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      errors: expect.arrayContaining([
        {
          field: 'title',
          message: 'Title must be provided',
        },
      ]),
    });
  });
  it('returns an 400 error if an invalid price is provided', async () => {
    const cookie = await global.signin();
    const response = await request(app)
      .post('/tickets')
      .set('Cookie', cookie)
      .send({ title: 'Title' });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          field: 'price',
          message: 'Price must be greater than 0',
        },
      ],
    });
  });
  it('creates a ticket with valid inputs', async () => {
    let ticketsCount = await TicketModel.estimatedDocumentCount();
    expect(ticketsCount).toBe(0);

    const cookie = await global.signin();
    const response = await request(app)
      .post('/tickets')
      .set('Cookie', cookie)
      .send({ title: 'Title', price: 10.0 });

    ticketsCount = await TicketModel.estimatedDocumentCount();
    expect(ticketsCount).toBe(1);

    const newTicket = await TicketModel.findOne({});

    expect(response.status).toBe(201);
    expect(newTicket).toMatchObject(response.body);
  });
});
