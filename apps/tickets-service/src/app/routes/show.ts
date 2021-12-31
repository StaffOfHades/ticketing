import { Response, Router } from 'express';
import { NotFoundError, TypedRequest, validateRequest } from '@udemy.com/middlewares/common';
import { param } from 'express-validator';
import { requireAuthentication } from '@udemy.com/middlewares/authentication';

import { TicketModel } from '../models/ticket';

const router = Router();

router.get(
  '/tickets/:id',
  requireAuthentication,
  [param('id').isMongoId().withMessage('A valid id must be provided')],
  validateRequest,
  async (req: TypedRequest, res: Response) => {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError(req.path);
    }

    res.status(200).send(ticket);
  }
);

export { router as showTicketRouter };
