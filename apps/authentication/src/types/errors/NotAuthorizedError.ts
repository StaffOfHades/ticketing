import { CustomError } from './ErrorResponse'

export class NotAuthorizedError extends CustomError {

  constructor() {
    super("Not authorized", 401);
  }

  serializeErrors() {
    return [{ message: this.message }]
  }

}
