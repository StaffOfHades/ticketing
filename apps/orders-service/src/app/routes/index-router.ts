import { Response, Router } from 'express';
import { NotFoundError, TypedRequest, validateRequest } from '@udemy.com/middlewares/common';
import { param } from 'express-validator';
import { requireAuthentication } from '@udemy.com/middlewares/authentication';

import { TicketModel } from '../models/ticket';

const router = Router();

router.get('/orders', requireAuthentication, async (req: TypedRequest, res: Response) => {
  const tickets = await TicketModel.find({ userId: req.currentUser!.id });

  res.status(200).send(tickets);
});

export { router as indexOrderRouter };
