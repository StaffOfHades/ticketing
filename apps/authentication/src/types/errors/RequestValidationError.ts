import { ValidationError } from 'express-validator'

import { CustomError } from './ErrorResponse'

export class RequestValidationError extends CustomError {

  constructor(private errors: Array<ValidationError>) {
    super("Invalid request after validation", 400);
  }

  serializeErrors() {
    return this.errors.map(({ param: field, msg: message }) => ({ field, message }))
  }

}
