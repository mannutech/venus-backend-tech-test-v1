"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = createLogger;
const pino_1 = __importDefault(require("pino"));
function createLogger(name) {
    const isProduction = true || process.env.NODE_ENV === "production";
    const isTest = process.env.NODE_ENV === "test";
    return (0, pino_1.default)({
        name: name || "tvl-api",
        level: isTest ? "silent" : isProduction ? "info" : "debug",
        transport: isProduction
            ? undefined
            : {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "SYS:standard",
                    ignore: "pid,hostname",
                },
            },
    });
}
