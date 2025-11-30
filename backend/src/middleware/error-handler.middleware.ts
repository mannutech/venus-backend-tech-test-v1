import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError, InternalError, ErrorCode } from '../errors/app.error';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import type { Logger } from '../config/logger.config';

interface ErrorDetail {
  field: string;
  message: string;
  received?: unknown;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}

export function createErrorHandler(logger: Logger): ErrorRequestHandler {
  return (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof ZodError) {
      const details: ErrorDetail[] = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
        received: e.code === 'invalid_type' ? undefined : (e as unknown as { received?: unknown }).received,
      }));

      logger.warn({ details }, 'Validation error');

      const response: ErrorResponse = {
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Invalid request parameters',
          details,
        },
      };

      res.status(StatusCodes.BAD_REQUEST).json(response);
      return;
    }

    if (err instanceof AppError) {
      // For InternalError, log the original error details server-side only
      if (err instanceof InternalError && err.originalError) {
        logger.error({ code: err.code, statusCode: err.statusCode, originalError: err.originalError }, 'Internal error');
      } else {
        logger.warn({ code: err.code, statusCode: err.statusCode }, err.message);
      }

      const response: ErrorResponse = {
        success: false,
        error: {
          code: err.code,
          message: err.message,
        },
      };

      res.status(err.statusCode).json(response);
      return;
    }

    // Unknown error
    logger.error({ err }, 'Unexpected error');

    const response: ErrorResponse = {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'An unexpected error occurred',
      },
    };

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
  };
}
