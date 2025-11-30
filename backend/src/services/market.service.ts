import { MarketRepository } from '../repositories/market.repository';
import { NotFoundError, InternalError } from '../errors/app.error';
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
 * Market Service - Business logic for TVL and liquidity calculations
 *
 * ## TODO: Future Improvements
 *
 * ### 1. Caching Layer
 * Currently, every request hits the database. Consider implementing:
 * - Redis cache (recommended for distributed/multi-instance deployments)
 *   - Cache keys: `tvl:${chainId || 'all'}`, `liquidity:${chainId || 'all'}`
 *   - TTL: 30-60 seconds for real-time data
 * - In-memory cache (suitable for single-instance deployments)
 *   - Use node-cache or Map with TTL
 * - Implementation: Inject cache service via constructor, check cache before DB query
 *
 * ### 2. BigInt Response Handling
 * Currently using Number() conversion for JSON responses. Considerations:
 * - Number.MAX_SAFE_INTEGER = 9,007,199,254,740,991 (~9 quadrillion)
 * - For cents: safe up to ~$90 trillion (sufficient for current DeFi scale)
 * - If handling raw token amounts (wei/18 decimals), switch to string responses:
 *   - Return tvl.toString() instead of Number(tvl)
 *   - Update OpenAPI schema to type: string, format: int64
 *
 * ### 3. Database Aggregation [DONE]
 * Implemented SQL SUM() aggregation in repository layer.
 * - Consider adding database index on chain_id for filtered queries
 *
 * ### 4. Pagination for Markets List
 * If adding a "list all markets" endpoint, implement cursor-based pagination
 *
 * ### 5. Rate Limiting
 * Consider adding rate limiting at the service or middleware level
 */
export class MarketService {
  constructor(
    private readonly repository: MarketRepository,
    private readonly logger: Logger
  ) {}

  async getTvl(chainId?: ChainId): Promise<bigint> {
    try {
      this.logger.debug({ chainId }, 'Calculating TVL');
      const tvl = await this.repository.sumTotalSupply(chainId);
      this.logger.info({ chainId, tvl: tvl.toString() }, 'TVL calculated');
      return tvl;
    } catch (error) {
      this.logger.error({ error, chainId }, 'Failed to calculate TVL');
      throw new InternalError(error instanceof Error ? error.message : 'Failed to calculate TVL');
    }
  }

  async getLiquidity(chainId?: ChainId): Promise<bigint> {
    try {
      this.logger.debug({ chainId }, 'Calculating liquidity');
      const liquidity = await this.repository.sumLiquidity(chainId);
      this.logger.info({ chainId, liquidity: liquidity.toString() }, 'Liquidity calculated');
      return liquidity;
    } catch (error) {
      this.logger.error({ error, chainId }, 'Failed to calculate liquidity');
      throw new InternalError(error instanceof Error ? error.message : 'Failed to calculate liquidity');
    }
  }

  async getMarket(name: string): Promise<MarketData> {
    try {
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
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      this.logger.error({ error, name }, 'Failed to get market');
      throw new InternalError(error instanceof Error ? error.message : 'Failed to get market');
    }
  }
}
