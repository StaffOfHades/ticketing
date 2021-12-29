export interface ErrorMessage {
  field?: string;
  message: string;
}

export interface ErrorResponse {
  errors: Array<ErrorMessage>
  type: 'ErrorResponse'
}

export interface ErrorResponseSerializer {
  serializeErrorResponse(): ErrorResponse
  statusCode: number;
}

export abstract class CustomError extends Error implements ErrorResponseSerializer {

  constructor(message: string, public statusCode: number) {
    super(message);
  }

  abstract serializeErrors(): Array<ErrorMessage>

  serializeErrorResponse(): ErrorResponse {
    return {
      errors: this.serializeErrors(),
      type: 'ErrorResponse'
    }
  }

}

export type AppError = Error | CustomError
