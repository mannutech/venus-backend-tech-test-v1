"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataSource = createDataSource;
exports.getDataSource = getDataSource;
const typeorm_1 = require("typeorm");
const market_entity_1 = require("../entities/market.entity");
const env_config_1 = require("../config/env.config");
function createDataSource() {
    const config = (0, env_config_1.getEnvConfig)();
    return new typeorm_1.DataSource({
        type: 'mysql',
        host: config.DB_HOST,
        port: config.DB_PORT,
        username: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        entities: [market_entity_1.Market],
        synchronize: false,
        logging: config.NODE_ENV === 'development',
    });
}
let dataSource = null;
function getDataSource() {
    if (!dataSource) {
        dataSource = createDataSource();
    }
    return dataSource;
}
