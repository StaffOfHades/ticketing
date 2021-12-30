import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { NotAuthorizedError } from '../../types/errors';

export const requireAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
