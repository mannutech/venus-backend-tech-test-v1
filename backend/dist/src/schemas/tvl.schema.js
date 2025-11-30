"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketQuerySchema = exports.tvlQuerySchema = exports.metricSchema = exports.chainIdSchema = void 0;
const zod_1 = require("zod");
exports.chainIdSchema = zod_1.z.string().min(1);
exports.metricSchema = zod_1.z.enum(['tvl', 'liquidity']);
exports.tvlQuerySchema = zod_1.z.object({
    chainId: exports.chainIdSchema.optional(),
    metric: exports.metricSchema.default('tvl'),
});
exports.marketQuerySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    metric: exports.metricSchema.default('tvl'),
});
