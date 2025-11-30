"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_error_1 = require("../../src/errors/app.error");
const http_status_codes_1 = require("http-status-codes");
describe('AppError', () => {
    it('should have statusCode, code, and message', () => {
        const error = new app_error_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, app_error_1.ErrorCode.VALIDATION_ERROR, 'Test message');
        expect(error.statusCode).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(error.code).toBe(app_error_1.ErrorCode.VALIDATION_ERROR);
        expect(error.message).toBe('Test message');
        expect(error.name).toBe('AppError');
    });
    it('should be an instance of Error', () => {
        const error = new app_error_1.AppError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, app_error_1.ErrorCode.INTERNAL_ERROR, 'Test');
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(app_error_1.AppError);
    });
});
describe('NotFoundError', () => {
    it('should have 404 status and NOT_FOUND code', () => {
        const error = new app_error_1.NotFoundError('Resource not found');
        expect(error.statusCode).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        expect(error.code).toBe(app_error_1.ErrorCode.NOT_FOUND);
        expect(error.message).toBe('Resource not found');
        expect(error.name).toBe('NotFoundError');
    });
    it('should be an instance of AppError', () => {
        const error = new app_error_1.NotFoundError('Not found');
        expect(error).toBeInstanceOf(app_error_1.AppError);
        expect(error).toBeInstanceOf(app_error_1.NotFoundError);
    });
});
describe('ValidationError', () => {
    it('should have 400 status and VALIDATION_ERROR code', () => {
        const error = new app_error_1.ValidationError('Invalid input');
        expect(error.statusCode).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(error.code).toBe(app_error_1.ErrorCode.VALIDATION_ERROR);
        expect(error.message).toBe('Invalid input');
        expect(error.name).toBe('ValidationError');
    });
    it('should be an instance of AppError', () => {
        const error = new app_error_1.ValidationError('Invalid');
        expect(error).toBeInstanceOf(app_error_1.AppError);
        expect(error).toBeInstanceOf(app_error_1.ValidationError);
    });
});
describe('InternalError', () => {
    it('should have 500 status and INTERNAL_ERROR code', () => {
        const error = new app_error_1.InternalError('Something went wrong');
        expect(error.statusCode).toBe(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(error.code).toBe(app_error_1.ErrorCode.INTERNAL_ERROR);
        // Message should always be generic for security - internal details not exposed
        expect(error.message).toBe('An unexpected error occurred');
        expect(error.name).toBe('InternalError');
    });
    it('should always return generic message to client', () => {
        const error = new app_error_1.InternalError('Database password exposed!');
        // Internal details should NEVER be in the message
        expect(error.message).toBe('An unexpected error occurred');
        expect(error.message).not.toContain('Database');
    });
    it('should store original error for server-side logging', () => {
        const originalMessage = 'Database connection failed: password invalid';
        const error = new app_error_1.InternalError(originalMessage);
        expect(error.originalError).toBe(originalMessage);
    });
    it('should store Error object as originalError', () => {
        const originalError = new Error('Connection timeout');
        const error = new app_error_1.InternalError(originalError);
        expect(error.originalError).toBe(originalError);
    });
    it('should have undefined originalError when not provided', () => {
        const error = new app_error_1.InternalError();
        expect(error.message).toBe('An unexpected error occurred');
        expect(error.originalError).toBeUndefined();
    });
    it('should be an instance of AppError', () => {
        const error = new app_error_1.InternalError();
        expect(error).toBeInstanceOf(app_error_1.AppError);
        expect(error).toBeInstanceOf(app_error_1.InternalError);
    });
});
