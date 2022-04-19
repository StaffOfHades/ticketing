import {
  NotAuthorizedError,
  NotFoundError,
  TypedRequest,
  validateRequest,
} from '@udemy.com/middlewares/common';
import { Response, Router } from 'express';
import { param } from 'express-validator';
import { requireAuthentication } from '@udemy.com/middlewares/authentication';

import { Ticket, TicketModel } from '../models/ticket';
import { TicketUpdatedPublisher } from '../nats/publishers';
import { client } from '../nats/client';

const router = Router();

router.delete(
  '/orders/:id',
  requireAuthentication,
  [param('id').isMongoId().withMessage('A valid id must be provided')],
  validateRequest,
  async (req: TypedRequest<Omit<Ticket, 'userId'>>, res: Response) => {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError(req.path);
    }
    if (ticket.userId !== req.currentUser.id) {
      throw new NotAuthorizedError();
    }

    const { price, title } = req.body;
    ticket.set({
      price,
      title,
    });

    await ticket.save();

    new TicketUpdatedPublisher(client.instance).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
    });

    res.status(200).send(ticket);
  }
);

export { router as deleteOrderRouter };
