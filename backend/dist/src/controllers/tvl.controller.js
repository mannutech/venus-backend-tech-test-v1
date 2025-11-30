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
exports.TvlController = void 0;
class TvlController {
    constructor(marketService, logger) {
        this.marketService = marketService;
        this.logger = logger;
        this.getTvl = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { chainId, metric } = req.query;
                this.logger.debug({ chainId, metric }, 'GET /tvl request');
                if (metric === 'liquidity') {
                    const liquidity = yield this.marketService.getLiquidity(chainId);
                    res.json({
                        success: true,
                        data: Object.assign({ liquidity, currency: 'cents' }, (chainId && { filters: { chainId } })),
                    });
                    return;
                }
                const tvl = yield this.marketService.getTvl(chainId);
                res.json({
                    success: true,
                    data: Object.assign({ tvl, currency: 'cents' }, (chainId && { filters: { chainId } })),
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getMarket = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.query;
                this.logger.debug({ name }, 'GET /markets request');
                const market = yield this.marketService.getMarket(name);
                res.json({
                    success: true,
                    data: {
                        id: market.id,
                        name: market.name,
                        chainId: market.chainId,
                        tvl: market.tvl,
                        liquidity: market.liquidity,
                        totalSupplyCents: market.totalSupplyCents,
                        totalBorrowCents: market.totalBorrowCents,
                        currency: 'cents',
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TvlController = TvlController;
