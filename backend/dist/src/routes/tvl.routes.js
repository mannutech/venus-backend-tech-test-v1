"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTvlRouter = createTvlRouter;
const express_1 = require("express");
const validate_middleware_1 = require("../middleware/validate.middleware");
const tvl_schema_1 = require("../schemas/tvl.schema");
function createTvlRouter(controller) {
    const router = (0, express_1.Router)();
    router.get('/tvl', (0, validate_middleware_1.validateQuery)(tvl_schema_1.tvlQuerySchema), controller.getTvl);
    router.get('/markets', (0, validate_middleware_1.validateQuery)(tvl_schema_1.marketQuerySchema), controller.getMarket);
    return router;
}
