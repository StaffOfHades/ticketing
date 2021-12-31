import { Response, Router } from 'express';
import { TypedRequest, validateRequest } from '@udemy.com/middlewares/common';
import { body } from 'express-validator';
import { requireAuthentication } from '@udemy.com/middlewares/authentication';

import { Ticket, TicketModel } from '../models/ticket';

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
    const newTicket = TicketModel.build({ ...req.body, userId: req.currentUser!.id });
    await newTicket.save();

    res.status(201).send(newTicket);
  }
);

export { router as createTicketRouter };
