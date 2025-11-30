"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const market_repository_1 = require("./repositories/market.repository");
const market_service_1 = require("./services/market.service");
const tvl_controller_1 = require("./controllers/tvl.controller");
const tvl_routes_1 = require("./routes/tvl.routes");
const error_handler_middleware_1 = require("./middleware/error-handler.middleware");
function createApp({ marketEntityRepository, logger }) {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Dependencies
    const marketRepository = new market_repository_1.MarketRepository(marketEntityRepository, logger);
    const marketService = new market_service_1.MarketService(marketRepository, logger);
    const tvlController = new tvl_controller_1.TvlController(marketService, logger);
    // Routes
    app.use('/api/v1', (0, tvl_routes_1.createTvlRouter)(tvlController));
    // Error handler (must be last)
    app.use((0, error_handler_middleware_1.createErrorHandler)(logger));
    return app;
}
