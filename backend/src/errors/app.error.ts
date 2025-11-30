import { StatusCodes } from 'http-status-codes';

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ErrorCode,
    message: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, ErrorCode.NOT_FOUND, message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, message);
  }
}

export class InternalError extends AppError {
  public readonly originalError?: Error | string;

  constructor(internalMessage?: string | Error) {
    // Always send safe generic message to client
    super(StatusCodes.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR, 'An unexpected error occurred');
    // Store original for server-side logging only
    this.originalError = internalMessage;
  }
}
