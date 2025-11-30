import request from 'supertest';
import { Express } from 'express';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { createApp } from '../../src/app';
import { Market } from '../../src/entities/market.entity';
import type { Logger } from '../../src/config/logger.config';

describe('TVL Routes Integration', () => {
  let app: Express;
  let mockRepository: MockProxy<Repository<Market>>;
  let mockLogger: MockProxy<Logger>;
  let mockQueryBuilder: MockProxy<SelectQueryBuilder<Market>>;

  const mockMarket: Market = {
    id: 1,
    name: 'Token 01',
    chainId: '1',
    totalSupplyCents: 10482,
    totalBorrowCents: 5915,
    createdAt: new Date(),
  };

  beforeEach(() => {
    mockRepository = mock<Repository<Market>>();
    mockLogger = mock<Logger>();
    mockQueryBuilder = mock<SelectQueryBuilder<Market>>();

    // Setup query builder chain
    mockQueryBuilder.select.mockReturnThis();
    mockQueryBuilder.addSelect.mockReturnThis();
    mockQueryBuilder.where.mockReturnThis();
    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    app = createApp({ marketEntityRepository: mockRepository, logger: mockLogger });
  });

  describe('GET /api/v1/tvl', () => {
    it('should return 200 with total TVL', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSupply: '63949', totalBorrow: null });

      const response = await request(app).get('/api/v1/tvl');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          tvl: 63949,
        },
      });
    });

    it('should return 200 with TVL filtered by chainId=1', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSupply: '30941', totalBorrow: null });

      const response = await request(app).get('/api/v1/tvl?chainId=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          tvl: 30941,
        },
      });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('market.chain_id = :chainId', { chainId: '1' });
    });

    it('should return 200 with TVL filtered by chainId=56', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSupply: '33008', totalBorrow: null });

      const response = await request(app).get('/api/v1/tvl?chainId=56');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          tvl: 33008,
        },
      });
    });

    it('should return 200 with 0 TVL for non-existent chainId', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSupply: null, totalBorrow: null });

      const response = await request(app).get('/api/v1/tvl?chainId=99');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          tvl: 0,
        },
      });
    });

    it('should return 200 with liquidity when metric=liquidity', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSupply: '63949', totalBorrow: '25718' });

      const response = await request(app).get('/api/v1/tvl?metric=liquidity');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          liquidity: 38231, // 63949 - 25718
        },
      });
    });

    it('should return 200 with liquidity filtered by chainId', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSupply: '30941', totalBorrow: '11627' });

      const response = await request(app).get('/api/v1/tvl?chainId=1&metric=liquidity');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          liquidity: 19314, // 30941 - 11627
        },
      });
    });

    it('should return 400 for invalid metric', async () => {
      const response = await request(app).get('/api/v1/tvl?metric=invalid');

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
    });

    it('should return 0 TVL when no markets exist', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSupply: null, totalBorrow: null });

      const response = await request(app).get('/api/v1/tvl');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          tvl: 0,
        },
      });
    });

    it('should return 0 liquidity when no markets exist', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSupply: null, totalBorrow: null });

      const response = await request(app).get('/api/v1/tvl?metric=liquidity');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          liquidity: 0,
        },
      });
    });

    it('should return 200 with liquidity filtered by chainId=56', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ totalSupply: '33008', totalBorrow: '14091' });

      const response = await request(app).get('/api/v1/tvl?chainId=56&metric=liquidity');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          liquidity: 18917, // 33008 - 14091
        },
      });
    });
  });

  describe('GET /api/v1/markets', () => {
    it('should return 200 with market data when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockMarket);

      const response = await request(app).get('/api/v1/markets?name=Token%2001');

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
        },
      });
    });

    it('should return 404 when market not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const response = await request(app).get('/api/v1/markets?name=NonExistent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Market not found: NonExistent',
        },
      });
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app).get('/api/v1/markets');

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
    });

    it('should return 400 when name is empty', async () => {
      const response = await request(app).get('/api/v1/markets?name=');

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
    });

    it('should return 200 with market data when metric=tvl is provided', async () => {
      mockRepository.findOne.mockResolvedValue(mockMarket);

      const response = await request(app).get('/api/v1/markets?name=Token%2001&metric=tvl');

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
        },
      });
    });

    it('should return 200 with market data when metric=liquidity is provided', async () => {
      mockRepository.findOne.mockResolvedValue(mockMarket);

      const response = await request(app).get('/api/v1/markets?name=Token%2001&metric=liquidity');

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
        },
      });
    });

    it('should return 400 for invalid metric on markets endpoint', async () => {
      const response = await request(app).get('/api/v1/markets?name=Token%2001&metric=invalid');

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
    });

    it('should handle URL encoded special characters in name', async () => {
      const marketWithSpecialName: Market = {
        id: 99,
        name: 'Token/Special&Name',
        chainId: '1',
        totalSupplyCents: 50000,
        totalBorrowCents: 20000,
        createdAt: new Date(),
      };
      mockRepository.findOne.mockResolvedValue(marketWithSpecialName);

      const response = await request(app).get('/api/v1/markets?name=Token%2FSpecial%26Name');

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
        },
      });
    });
  });
});
