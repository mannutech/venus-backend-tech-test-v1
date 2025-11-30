import { MarketRepository } from '../repositories/market.repository';
import { NotFoundError } from '../errors/app.error';
import type { ChainId } from '../schemas/tvl.schema';
import type { Logger } from '../config/logger.config';

export interface MarketData {
  id: number;
  name: string;
  chainId: string;
  totalSupplyCents: number;
  totalBorrowCents: number;
  tvl: number;
  liquidity: number;
}

/**
 * TODO: Implement caching layer for TVL/liquidity calculations
 *
 * Options to consider:
 * 1. Redis cache with TTL (recommended for distributed systems)
 *    - Cache key pattern: `tvl:${chainId || 'all'}`, `liquidity:${chainId || 'all'}`
 *    - TTL: 60 seconds for real-time data, or longer for reports
 *    - Invalidate on market data updates
 *
 * 2. In-memory cache (simple, single-instance only)
 *    - Use node-cache or Map with TTL
 *    - Suitable for low-traffic or single-server deployments
 *
 * Implementation steps:
 * - Inject cache service via constructor (dependency injection)
 * - Check cache before database query
 * - Set cache after calculation
 * - Add cache invalidation hooks for data mutations
 */
export class MarketService {
  constructor(
    private readonly repository: MarketRepository,
    private readonly logger: Logger
  ) {}

  async getTvl(chainId?: ChainId): Promise<bigint> {
    this.logger.debug({ chainId }, 'Calculating TVL');
    const markets = await this.repository.findAll(chainId);
    const tvl = markets.reduce((sum, market) => sum + BigInt(market.totalSupplyCents), 0n);
    this.logger.info({ chainId, tvl: tvl.toString(), marketCount: markets.length }, 'TVL calculated');
    return tvl;
  }

  async getLiquidity(chainId?: ChainId): Promise<bigint> {
    this.logger.debug({ chainId }, 'Calculating liquidity');
    const markets = await this.repository.findAll(chainId);
    const liquidity = markets.reduce(
      (sum, market) => sum + (BigInt(market.totalSupplyCents) - BigInt(market.totalBorrowCents)),
      0n
    );
    this.logger.info({ chainId, liquidity: liquidity.toString(), marketCount: markets.length }, 'Liquidity calculated');
    return liquidity;
  }

  async getMarket(name: string): Promise<MarketData> {
    this.logger.debug({ name }, 'Getting market');
    const market = await this.repository.findByName(name);

    if (!market) {
      this.logger.warn({ name }, 'Market not found');
      throw new NotFoundError(`Market not found: ${name}`);
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
  }
}
