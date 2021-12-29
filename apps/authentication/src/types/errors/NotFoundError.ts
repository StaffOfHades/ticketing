import { CustomError } from './ErrorResponse'

export class NotFoundError extends CustomError {
  constructor(private path: string) {
    super("Route not found", 404);
  }

  serializeErrors() {
    return [{ field: this.path, message: "NotFound" }]
  }
}
