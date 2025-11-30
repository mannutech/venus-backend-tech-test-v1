"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnvConfig = loadEnvConfig;
exports.getEnvConfig = getEnvConfig;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']),
    PORT: zod_1.z.string().transform(Number),
    DB_HOST: zod_1.z.string().min(1),
    DB_PORT: zod_1.z.string().transform(Number),
    DB_USER: zod_1.z.string().min(1),
    DB_PASSWORD: zod_1.z.string().min(1),
    DB_NAME: zod_1.z.string().min(1),
});
let config = null;
function loadEnvConfig() {
    if (config) {
        return config;
    }
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        const missing = result.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`);
        throw new Error(`Missing or invalid environment variables:\n${missing.join('\n')}`);
    }
    config = result.data;
    return config;
}
function getEnvConfig() {
    if (!config) {
        throw new Error('Environment config not loaded. Call loadEnvConfig() first.');
    }
    return config;
}
