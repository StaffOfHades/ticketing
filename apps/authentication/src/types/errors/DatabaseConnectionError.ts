import { CustomError } from './ErrorResponse'

export class DatabaseConnectionError extends CustomError {

  constructor() {
    super('Error connecting to database', 503);
  }

  serializeErrors() {
    return [{ message: this.message }]
  }

}
