import request from 'supertest';

import { TicketModel } from '../../models/ticket';
import { app } from '../../index';

describe('GET /tickets', () => {
  it('has a route handler listening to requests', async () => {
    const response = await request(app).get('/tickets').send({});

    expect(response.status).not.toBe(404);
  });
  it('returns a 401 error if a user is not authenticated', () => {
    return request(app).get('/tickets').send({}).expect(401);
  });
  it('returns a list of tickets', async () => {
    const user = { email: 'test@test.com', id: '1' };
    const ticketsCount = 3;
    const tickets = [];
    for (let i = 1; i <= ticketsCount; i++) {
      const ticketData = { price: 0.5 * i, title: `Ticket ${i}`, userId: user.id };
      tickets.push(ticketData);
      const newTicket = TicketModel.build(ticketData);
      await newTicket.save();
    }

    const cookie = await global.signin(user);
    const response = await request(app).get('/tickets/').set('Cookie', cookie).send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(ticketsCount);
    expect(response.body).toMatchObject(tickets);
  });
  it('only returns tickets for the user', async () => {
    const user = { email: 'test@test.com', id: '1' };
    const ticketsCount = 3;
    const tickets = [];
    for (let i = 1; i <= ticketsCount; i++) {
      const ticketData = { price: 0.5 * i, title: `Ticket ${i}`, userId: user.id };
      tickets.push(ticketData);
      const newTicket = TicketModel.build(ticketData);
      await newTicket.save();
    }
    const newTicket = TicketModel.build({ price: 10.0, title: 'Other ticket', userId: '2' });
    await newTicket.save();

    const cookie = await global.signin(user);
    const response = await request(app).get('/tickets/').set('Cookie', cookie).send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(ticketsCount);
    expect(response.body).toMatchObject(tickets);
  });
});
