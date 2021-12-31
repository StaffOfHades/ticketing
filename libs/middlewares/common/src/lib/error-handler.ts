import { Request, Response } from 'express';

import { AppError, CustomError, ErrorResponse } from '../types/errors';

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _
) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).send(error.serializeErrorResponse());
  }

  console.log("Unable to handle error since it's not a CustomError");
  console.error(error);
  const response: ErrorResponse = {
    errors: [{ message: 'Something went wrong' }],
    type: 'ErrorResponse',
  };
  res.status(400).send(response);
};
