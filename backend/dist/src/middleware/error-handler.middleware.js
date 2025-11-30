"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorHandler = createErrorHandler;
const app_error_1 = require("../errors/app.error");
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
function createErrorHandler(logger) {
    return (err, _req, res, _next) => {
        if (err instanceof zod_1.ZodError) {
            const details = err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
                received: e.code === 'invalid_type' ? undefined : e.received,
            }));
            logger.warn({ details }, 'Validation error');
            const response = {
                success: false,
                error: {
                    code: app_error_1.ErrorCode.VALIDATION_ERROR,
                    message: 'Invalid request parameters',
                    details,
                },
            };
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
            return;
        }
        if (err instanceof app_error_1.AppError) {
            // For InternalError, log the original error details server-side only
            if (err instanceof app_error_1.InternalError && err.originalError) {
                logger.error({ code: err.code, statusCode: err.statusCode, originalError: err.originalError }, 'Internal error');
            }
            else {
                logger.warn({ code: err.code, statusCode: err.statusCode }, err.message);
            }
            const response = {
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
        const response = {
            success: false,
            error: {
                code: app_error_1.ErrorCode.INTERNAL_ERROR,
                message: 'An unexpected error occurred',
            },
        };
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    };
}
