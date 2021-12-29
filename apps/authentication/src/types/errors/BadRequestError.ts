import { CustomError } from './ErrorResponse'

export class BadRequestError extends CustomError {

  constructor(message: string) {
    super(message, 400);
  }

  serializeErrors() {
    return [{ message: this.message }]
  }

}
