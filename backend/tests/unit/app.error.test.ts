import {
  AppError,
  NotFoundError,
  ValidationError,
  InternalError,
  ErrorCode,
} from '../../src/errors/app.error';
import { StatusCodes } from 'http-status-codes';

describe('AppError', () => {
  it('should have statusCode, code, and message', () => {
    const error = new AppError(StatusCodes.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, 'Test message');

    expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(error.message).toBe('Test message');
    expect(error.name).toBe('AppError');
  });

  it('should be an instance of Error', () => {
    const error = new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR, 'Test');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });
});

describe('NotFoundError', () => {
  it('should have 404 status and NOT_FOUND code', () => {
    const error = new NotFoundError('Resource not found');

    expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(error.code).toBe(ErrorCode.NOT_FOUND);
    expect(error.message).toBe('Resource not found');
    expect(error.name).toBe('NotFoundError');
  });

  it('should be an instance of AppError', () => {
    const error = new NotFoundError('Not found');

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(NotFoundError);
  });
});

describe('ValidationError', () => {
  it('should have 400 status and VALIDATION_ERROR code', () => {
    const error = new ValidationError('Invalid input');

    expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(error.message).toBe('Invalid input');
    expect(error.name).toBe('ValidationError');
  });

  it('should be an instance of AppError', () => {
    const error = new ValidationError('Invalid');

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(ValidationError);
  });
});

describe('InternalError', () => {
  it('should have 500 status and INTERNAL_ERROR code', () => {
    const error = new InternalError('Something went wrong');

    expect(error.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(error.code).toBe(ErrorCode.INTERNAL_ERROR);
    // Message should always be generic for security - internal details not exposed
    expect(error.message).toBe('An unexpected error occurred');
    expect(error.name).toBe('InternalError');
  });

  it('should always return generic message to client', () => {
    const error = new InternalError('Database password exposed!');

    // Internal details should NEVER be in the message
    expect(error.message).toBe('An unexpected error occurred');
    expect(error.message).not.toContain('Database');
  });

  it('should store original error for server-side logging', () => {
    const originalMessage = 'Database connection failed: password invalid';
    const error = new InternalError(originalMessage);

    expect(error.originalError).toBe(originalMessage);
  });

  it('should store Error object as originalError', () => {
    const originalError = new Error('Connection timeout');
    const error = new InternalError(originalError);

    expect(error.originalError).toBe(originalError);
  });

  it('should have undefined originalError when not provided', () => {
    const error = new InternalError();

    expect(error.message).toBe('An unexpected error occurred');
    expect(error.originalError).toBeUndefined();
  });

  it('should be an instance of AppError', () => {
    const error = new InternalError();

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(InternalError);
  });
});
