import {
  NotAuthorizedError,
  NotFoundError,
  TypedRequest,
  validateRequest,
} from '@udemy.com/middlewares/common';
import { Response, Router } from 'express';
import { param, body } from 'express-validator';
import { requireAuthentication } from '@udemy.com/middlewares/authentication';

import { Ticket, TicketModel } from '../models/ticket';

const router = Router();

router.put(
  '/tickets/:id',
  requireAuthentication,
  [
    param('id').isMongoId().withMessage('A valid id must be provided'),
    body('title').notEmpty().withMessage('Title must be provided'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  ],
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

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
