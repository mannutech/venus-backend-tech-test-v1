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

  const mockMarket: Market = {
    id: 1,
    name: 'Token 01',
    chainId: '1',
    totalSupplyCents: 10000,
    totalBorrowCents: 3000,
    createdAt: new Date(),
  };

  beforeEach(() => {
    repository = mock<MarketRepository>();
    logger = mock<Logger>();
    service = new MarketService(repository, logger);
  });

  describe('getTvl', () => {
    it('should return TVL from repository aggregation', async () => {
      repository.sumTotalSupply.mockResolvedValue(45000n);

      const result = await service.getTvl();

      expect(result).toBe(45000n);
      expect(repository.sumTotalSupply).toHaveBeenCalledWith(undefined);
    });

    it('should pass chainId to repository', async () => {
      repository.sumTotalSupply.mockResolvedValue(30000n);

      const result = await service.getTvl('1');

      expect(result).toBe(30000n);
      expect(repository.sumTotalSupply).toHaveBeenCalledWith('1');
    });

    it('should return 0n when no markets found', async () => {
      repository.sumTotalSupply.mockResolvedValue(0n);

      const result = await service.getTvl();

      expect(result).toBe(0n);
    });
  });

  describe('getLiquidity', () => {
    it('should return liquidity from repository aggregation', async () => {
      repository.sumLiquidity.mockResolvedValue(33000n);

      const result = await service.getLiquidity();

      expect(result).toBe(33000n);
      expect(repository.sumLiquidity).toHaveBeenCalledWith(undefined);
    });

    it('should pass chainId to repository', async () => {
      repository.sumLiquidity.mockResolvedValue(11000n);

      const result = await service.getLiquidity('56');

      expect(result).toBe(11000n);
      expect(repository.sumLiquidity).toHaveBeenCalledWith('56');
    });

    it('should return 0n when no markets found', async () => {
      repository.sumLiquidity.mockResolvedValue(0n);

      const result = await service.getLiquidity();

      expect(result).toBe(0n);
    });
  });

  describe('getMarket', () => {
    it('should return market data when found', async () => {
      repository.findByName.mockResolvedValue(mockMarket);

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
