import { Response, Router } from 'express';
import { TypedRequest, validateRequest } from '@udemy.com/middlewares/common';
import { body } from 'express-validator';
import { requireAuthentication } from '@udemy.com/middlewares/authentication';

import { Ticket, TicketModel } from '../models/ticket';
import { TicketCreatedPublisher } from '../nats/publishers';
import { client } from '../nats/client';

const router = Router();

router.post(
  '/tickets',
  requireAuthentication,
  [
    body('title').notEmpty().withMessage('Title must be provided'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: TypedRequest<Omit<Ticket, 'userId'>>, res: Response) => {
    const { price, title } = req.body;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newTicket = TicketModel.build({ price, title, userId: req.currentUser!.id });
    await newTicket.save();

    new TicketCreatedPublisher(client.instance).publish({
      id: newTicket.id,
      title: newTicket.id,
      price: newTicket.price,
      userId: newTicket.userId,
    });

    res.status(201).send(newTicket);
  }
);

export { router as createTicketRouter };
