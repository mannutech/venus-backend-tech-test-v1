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
const jest_mock_extended_1 = require("jest-mock-extended");
const market_service_1 = require("../../src/services/market.service");
const app_error_1 = require("../../src/errors/app.error");
describe('MarketService', () => {
    let service;
    let repository;
    let logger;
    const mockMarkets = [
        {
            id: 1,
            name: 'Token 01',
            chainId: '1',
            totalSupplyCents: 10000,
            totalBorrowCents: 3000,
            createdAt: new Date(),
        },
        {
            id: 2,
            name: 'Token 02',
            chainId: '1',
            totalSupplyCents: 20000,
            totalBorrowCents: 5000,
            createdAt: new Date(),
        },
        {
            id: 3,
            name: 'Token 03',
            chainId: '56',
            totalSupplyCents: 15000,
            totalBorrowCents: 4000,
            createdAt: new Date(),
        },
    ];
    beforeEach(() => {
        repository = (0, jest_mock_extended_1.mock)();
        logger = (0, jest_mock_extended_1.mock)();
        service = new market_service_1.MarketService(repository, logger);
    });
    describe('getTvl', () => {
        it('should return sum of all totalSupplyCents', () => __awaiter(void 0, void 0, void 0, function* () {
            repository.findAll.mockResolvedValue(mockMarkets);
            const result = yield service.getTvl();
            expect(result).toBe(45000); // 10000 + 20000 + 15000
            expect(repository.findAll).toHaveBeenCalledWith(undefined);
        }));
        it('should return sum filtered by chainId', () => __awaiter(void 0, void 0, void 0, function* () {
            const chain1Markets = mockMarkets.filter((m) => m.chainId === '1');
            repository.findAll.mockResolvedValue(chain1Markets);
            const result = yield service.getTvl('1');
            expect(result).toBe(30000); // 10000 + 20000
            expect(repository.findAll).toHaveBeenCalledWith('1');
        }));
        it('should return 0 when no markets found', () => __awaiter(void 0, void 0, void 0, function* () {
            repository.findAll.mockResolvedValue([]);
            const result = yield service.getTvl();
            expect(result).toBe(0);
        }));
    });
    describe('getLiquidity', () => {
        it('should return sum of (totalSupplyCents - totalBorrowCents)', () => __awaiter(void 0, void 0, void 0, function* () {
            repository.findAll.mockResolvedValue(mockMarkets);
            const result = yield service.getLiquidity();
            // (10000-3000) + (20000-5000) + (15000-4000) = 7000 + 15000 + 11000 = 33000
            expect(result).toBe(33000);
            expect(repository.findAll).toHaveBeenCalledWith(undefined);
        }));
        it('should return sum filtered by chainId', () => __awaiter(void 0, void 0, void 0, function* () {
            const chain56Markets = mockMarkets.filter((m) => m.chainId === '56');
            repository.findAll.mockResolvedValue(chain56Markets);
            const result = yield service.getLiquidity('56');
            expect(result).toBe(11000); // 15000 - 4000
            expect(repository.findAll).toHaveBeenCalledWith('56');
        }));
        it('should return 0 when no markets found', () => __awaiter(void 0, void 0, void 0, function* () {
            repository.findAll.mockResolvedValue([]);
            const result = yield service.getLiquidity();
            expect(result).toBe(0);
        }));
    });
    describe('getMarket', () => {
        it('should return market data when found', () => __awaiter(void 0, void 0, void 0, function* () {
            const market = mockMarkets[0];
            repository.findByName.mockResolvedValue(market);
            const result = yield service.getMarket('Token 01');
            expect(result).toEqual({
                id: 1,
                name: 'Token 01',
                chainId: '1',
                totalSupplyCents: 10000,
                totalBorrowCents: 3000,
                tvl: 10000,
                liquidity: 7000,
            });
            expect(repository.findByName).toHaveBeenCalledWith('Token 01');
        }));
        it('should throw NotFoundError when market not found', () => __awaiter(void 0, void 0, void 0, function* () {
            repository.findByName.mockResolvedValue(null);
            yield expect(service.getMarket('NonExistent')).rejects.toThrow(app_error_1.NotFoundError);
            expect(repository.findByName).toHaveBeenCalledWith('NonExistent');
        }));
    });
});
