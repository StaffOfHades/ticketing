import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '@udemy.com/middlewares/common';

export const requireAuthentication = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
