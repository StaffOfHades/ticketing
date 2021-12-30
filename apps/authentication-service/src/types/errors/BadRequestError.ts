import { CustomError } from './ErrorResponse';

export class BadRequestError extends CustomError {
  constructor(message: string, private field?: string) {
    super(message, 400);
  }

  serializeErrors() {
    return [{ field: this.field, message: this.message }];
  }
}
