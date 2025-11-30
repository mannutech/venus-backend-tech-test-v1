import { mock, MockProxy } from 'jest-mock-extended';
import { MarketService } from '../../src/services/market.service';
import { MarketRepository } from '../../src/repositories/market.repository';
import { Market } from '../../src/entities/market.entity';
import { NotFoundError } from '../../src/errors/app.error';
import type { Logger } from '../../src/config/logger.config';

describe('MarketService', () => {
  let service: MarketService;
  let repository: MockProxy<MarketRepository>;
  let logger: MockProxy<Logger>;

  const mockMarkets: Market[] = [
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
    repository = mock<MarketRepository>();
    logger = mock<Logger>();
    service = new MarketService(repository, logger);
  });

  describe('getTvl', () => {
    it('should return sum of all totalSupplyCents as BigInt', async () => {
      repository.findAll.mockResolvedValue(mockMarkets);

      const result = await service.getTvl();

      expect(result).toBe(45000n); // 10000 + 20000 + 15000
      expect(repository.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return sum filtered by chainId', async () => {
      const chain1Markets = mockMarkets.filter((m) => m.chainId === '1');
      repository.findAll.mockResolvedValue(chain1Markets);

      const result = await service.getTvl('1');

      expect(result).toBe(30000n); // 10000 + 20000
      expect(repository.findAll).toHaveBeenCalledWith('1');
    });

    it('should return 0n when no markets found', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.getTvl();

      expect(result).toBe(0n);
    });
  });

  describe('getLiquidity', () => {
    it('should return sum of (totalSupplyCents - totalBorrowCents) as BigInt', async () => {
      repository.findAll.mockResolvedValue(mockMarkets);

      const result = await service.getLiquidity();

      // (10000-3000) + (20000-5000) + (15000-4000) = 7000 + 15000 + 11000 = 33000
      expect(result).toBe(33000n);
      expect(repository.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return sum filtered by chainId', async () => {
      const chain56Markets = mockMarkets.filter((m) => m.chainId === '56');
      repository.findAll.mockResolvedValue(chain56Markets);

      const result = await service.getLiquidity('56');

      expect(result).toBe(11000n); // 15000 - 4000
      expect(repository.findAll).toHaveBeenCalledWith('56');
    });

    it('should return 0n when no markets found', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.getLiquidity();

      expect(result).toBe(0n);
    });
  });

  describe('getMarket', () => {
    it('should return market data when found', async () => {
      const market = mockMarkets[0];
      repository.findByName.mockResolvedValue(market);

      const result = await service.getMarket('Token 01');

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
    });

    it('should throw NotFoundError when market not found', async () => {
      repository.findByName.mockResolvedValue(null);

      await expect(service.getMarket('NonExistent')).rejects.toThrow(
        NotFoundError
      );
      expect(repository.findByName).toHaveBeenCalledWith('NonExistent');
    });
  });
});
