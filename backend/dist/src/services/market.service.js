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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketService = void 0;
const app_error_1 = require("../errors/app.error");
class MarketService {
    constructor(repository, logger) {
        this.repository = repository;
        this.logger = logger;
    }
    getTvl(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug({ chainId }, 'Calculating TVL');
            const markets = yield this.repository.findAll(chainId);
            const tvl = markets.reduce((sum, market) => sum + Number(market.totalSupplyCents), 0);
            this.logger.info({ chainId, tvl, marketCount: markets.length }, 'TVL calculated');
            return tvl;
        });
    }
    getLiquidity(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug({ chainId }, 'Calculating liquidity');
            const markets = yield this.repository.findAll(chainId);
            const liquidity = markets.reduce((sum, market) => sum + (Number(market.totalSupplyCents) - Number(market.totalBorrowCents)), 0);
            this.logger.info({ chainId, liquidity, marketCount: markets.length }, 'Liquidity calculated');
            return liquidity;
        });
    }
    getMarket(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug({ name }, 'Getting market');
            const market = yield this.repository.findByName(name);
            if (!market) {
                this.logger.warn({ name }, 'Market not found');
                throw new app_error_1.NotFoundError(`Market not found: ${name}`);
            }
            this.logger.info({ name, marketId: market.id }, 'Market found');
            return {
                id: market.id,
                name: market.name,
                chainId: market.chainId,
                totalSupplyCents: Number(market.totalSupplyCents),
                totalBorrowCents: Number(market.totalBorrowCents),
                tvl: Number(market.totalSupplyCents),
                liquidity: Number(market.totalSupplyCents) - Number(market.totalBorrowCents),
            };
        });
    }
}
exports.MarketService = MarketService;
