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
const supertest_1 = __importDefault(require("supertest"));
const jest_mock_extended_1 = require("jest-mock-extended");
const app_1 = require("../../src/app");
describe('TVL Routes Integration', () => {
    let app;
    let mockRepository;
    let mockLogger;
    const mockMarkets = [
        {
            id: 1,
            name: 'Token 01',
            chainId: '1',
            totalSupplyCents: 10482,
            totalBorrowCents: 5915,
            createdAt: new Date(),
        },
        {
            id: 2,
            name: 'Token 02',
            chainId: '1',
            totalSupplyCents: 20459,
            totalBorrowCents: 5712,
            createdAt: new Date(),
        },
        {
            id: 3,
            name: 'Token 14',
            chainId: '56',
            totalSupplyCents: 33008,
            totalBorrowCents: 14091,
            createdAt: new Date(),
        },
    ];
    beforeEach(() => {
        mockRepository = (0, jest_mock_extended_1.mock)();
        mockLogger = (0, jest_mock_extended_1.mock)();
        app = (0, app_1.createApp)({ marketEntityRepository: mockRepository, logger: mockLogger });
    });
    describe('GET /api/v1/tvl', () => {
        it('should return 200 with total TVL', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepository.find.mockResolvedValue(mockMarkets);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/tvl');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    tvl: 63949, // 10482 + 20459 + 33008
                    currency: 'cents',
                },
            });
        }));
        it('should return 200 with TVL filtered by chainId=1', () => __awaiter(void 0, void 0, void 0, function* () {
            const chain1Markets = mockMarkets.filter((m) => m.chainId === '1');
            mockRepository.find.mockResolvedValue(chain1Markets);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/tvl?chainId=1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    tvl: 30941, // 10482 + 20459
                    currency: 'cents',
                    filters: { chainId: '1' },
                },
            });
        }));
        it('should return 200 with TVL filtered by chainId=56', () => __awaiter(void 0, void 0, void 0, function* () {
            const chain56Markets = mockMarkets.filter((m) => m.chainId === '56');
            mockRepository.find.mockResolvedValue(chain56Markets);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/tvl?chainId=56');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    tvl: 33008,
                    currency: 'cents',
                    filters: { chainId: '56' },
                },
            });
        }));
        it('should return 200 with 0 TVL for non-existent chainId', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepository.find.mockResolvedValue([]);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/tvl?chainId=99');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    tvl: 0,
                    currency: 'cents',
                    filters: { chainId: '99' },
                },
            });
        }));
        it('should return 200 with liquidity when metric=liquidity', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepository.find.mockResolvedValue(mockMarkets);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/tvl?metric=liquidity');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    // (10482-5915) + (20459-5712) + (33008-14091) = 4567 + 14747 + 18917 = 38231
                    liquidity: 38231,
                    currency: 'cents',
                },
            });
        }));
        it('should return 200 with liquidity filtered by chainId', () => __awaiter(void 0, void 0, void 0, function* () {
            const chain1Markets = mockMarkets.filter((m) => m.chainId === '1');
            mockRepository.find.mockResolvedValue(chain1Markets);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/tvl?chainId=1&metric=liquidity');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    // (10482-5915) + (20459-5712) = 4567 + 14747 = 19314
                    liquidity: 19314,
                    currency: 'cents',
                    filters: { chainId: '1' },
                },
            });
        }));
        it('should return 400 for invalid metric', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get('/api/v1/tvl?metric=invalid');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid request parameters',
                    details: expect.arrayContaining([
                        expect.objectContaining({
                            field: 'metric',
                        }),
                    ]),
                },
            });
        }));
        it('should return 0 TVL when no markets exist', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepository.find.mockResolvedValue([]);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/tvl');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    tvl: 0,
                    currency: 'cents',
                },
            });
        }));
        it('should return 0 liquidity when no markets exist', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepository.find.mockResolvedValue([]);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/tvl?metric=liquidity');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    liquidity: 0,
                    currency: 'cents',
                },
            });
        }));
        it('should return 200 with liquidity filtered by chainId=56', () => __awaiter(void 0, void 0, void 0, function* () {
            const chain56Markets = mockMarkets.filter((m) => m.chainId === '56');
            mockRepository.find.mockResolvedValue(chain56Markets);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/tvl?chainId=56&metric=liquidity');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    // 33008 - 14091 = 18917
                    liquidity: 18917,
                    currency: 'cents',
                    filters: { chainId: '56' },
                },
            });
        }));
    });
    describe('GET /api/v1/markets', () => {
        it('should return 200 with market data when found', () => __awaiter(void 0, void 0, void 0, function* () {
            const market = mockMarkets[0];
            mockRepository.findOne.mockResolvedValue(market);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/markets?name=Token%2001');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    id: 1,
                    name: 'Token 01',
                    chainId: '1',
                    tvl: 10482,
                    liquidity: 4567, // 10482 - 5915
                    totalSupplyCents: 10482,
                    totalBorrowCents: 5915,
                    currency: 'cents',
                },
            });
        }));
        it('should return 404 when market not found', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepository.findOne.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/markets?name=NonExistent');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Market not found: NonExistent',
                },
            });
        }));
        it('should return 400 when name is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get('/api/v1/markets');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid request parameters',
                    details: expect.arrayContaining([
                        expect.objectContaining({
                            field: 'name',
                        }),
                    ]),
                },
            });
        }));
        it('should return 400 when name is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get('/api/v1/markets?name=');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid request parameters',
                    details: expect.arrayContaining([
                        expect.objectContaining({
                            field: 'name',
                        }),
                    ]),
                },
            });
        }));
        it('should return 200 with market data when metric=tvl is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const market = mockMarkets[0];
            mockRepository.findOne.mockResolvedValue(market);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/markets?name=Token%2001&metric=tvl');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    id: 1,
                    name: 'Token 01',
                    chainId: '1',
                    tvl: 10482,
                    liquidity: 4567,
                    totalSupplyCents: 10482,
                    totalBorrowCents: 5915,
                    currency: 'cents',
                },
            });
        }));
        it('should return 200 with market data when metric=liquidity is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const market = mockMarkets[0];
            mockRepository.findOne.mockResolvedValue(market);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/markets?name=Token%2001&metric=liquidity');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    id: 1,
                    name: 'Token 01',
                    chainId: '1',
                    tvl: 10482,
                    liquidity: 4567,
                    totalSupplyCents: 10482,
                    totalBorrowCents: 5915,
                    currency: 'cents',
                },
            });
        }));
        it('should return 400 for invalid metric on markets endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get('/api/v1/markets?name=Token%2001&metric=invalid');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid request parameters',
                    details: expect.arrayContaining([
                        expect.objectContaining({
                            field: 'metric',
                        }),
                    ]),
                },
            });
        }));
        it('should handle URL encoded special characters in name', () => __awaiter(void 0, void 0, void 0, function* () {
            const marketWithSpecialName = {
                id: 99,
                name: 'Token/Special&Name',
                chainId: '1',
                totalSupplyCents: 50000,
                totalBorrowCents: 20000,
                createdAt: new Date(),
            };
            mockRepository.findOne.mockResolvedValue(marketWithSpecialName);
            const response = yield (0, supertest_1.default)(app).get('/api/v1/markets?name=Token%2FSpecial%26Name');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    id: 99,
                    name: 'Token/Special&Name',
                    chainId: '1',
                    tvl: 50000,
                    liquidity: 30000,
                    totalSupplyCents: 50000,
                    totalBorrowCents: 20000,
                    currency: 'cents',
                },
            });
        }));
    });
});
