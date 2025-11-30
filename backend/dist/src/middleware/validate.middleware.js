"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = validateQuery;
function validateQuery(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            next(result.error);
            return;
        }
        req.query = result.data;
        next();
    };
}
