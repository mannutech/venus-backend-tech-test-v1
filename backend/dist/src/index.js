"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const env_config_1 = require("./config/env.config");
const logger_config_1 = require("./config/logger.config");
const data_source_1 = require("./database/data-source");
const app_1 = require("./app");
const market_entity_1 = require("./entities/market.entity");
dotenv_1.default.config();
const logger = (0, logger_config_1.createLogger)();
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, env_config_1.loadEnvConfig)();
        logger.info({ nodeEnv: config.NODE_ENV }, 'Starting application');
        const dataSource = (0, data_source_1.getDataSource)();
        yield dataSource.initialize();
        logger.info({ host: config.DB_HOST, database: config.DB_NAME }, 'Database connected');
        const marketEntityRepository = dataSource.getRepository(market_entity_1.Market);
        const app = (0, app_1.createApp)({ marketEntityRepository, logger });
        app.listen(config.PORT, () => {
            logger.info({ port: config.PORT }, 'Server started');
        });
    });
}
bootstrap().catch((error) => {
    logger.fatal({ err: error }, 'Failed to start server');
    process.exit(1);
});
