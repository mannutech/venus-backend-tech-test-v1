"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.ValidationError = exports.NotFoundError = exports.AppError = exports.ErrorCode = void 0;
const http_status_codes_1 = require("http-status-codes");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
class AppError extends Error {
    constructor(statusCode, code, message) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.NOT_FOUND, ErrorCode.NOT_FOUND, message);
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends AppError {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, message);
    }
}
exports.ValidationError = ValidationError;
class InternalError extends AppError {
    constructor(internalMessage) {
        // Always send safe generic message to client
        super(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR, 'An unexpected error occurred');
        // Store original for server-side logging only
        this.originalError = internalMessage;
    }
}
exports.InternalError = InternalError;
