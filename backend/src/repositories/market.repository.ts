import { Repository } from 'typeorm';
import { Market } from '../entities/market.entity';
import type { ChainId } from '../schemas/tvl.schema';
import type { Logger } from '../config/logger.config';

export interface AggregateResult {
  totalSupply: string | null;
  totalBorrow: string | null;
}

export class MarketRepository {
  constructor(
    private readonly repository: Repository<Market>,
    private readonly logger: Logger
  ) {}

  /**
   * Calculates TVL (total supply) using SQL SUM aggregation.
   * More efficient than fetching all rows for large datasets.
   */
  async sumTotalSupply(chainId?: ChainId): Promise<bigint> {
    this.logger.debug({ chainId }, 'Calculating sum of total supply');

    const qb = this.repository
      .createQueryBuilder('market')
      .select('SUM(market.total_supply_cents)', 'totalSupply');

    if (chainId) {
      qb.where('market.chain_id = :chainId', { chainId });
    }

    const result = await qb.getRawOne<AggregateResult>();
    return BigInt(result?.totalSupply || '0');
  }

  /**
   * Calculates liquidity (supply - borrow) using SQL SUM aggregation.
   */
  async sumLiquidity(chainId?: ChainId): Promise<bigint> {
    this.logger.debug({ chainId }, 'Calculating sum of liquidity');

    const qb = this.repository
      .createQueryBuilder('market')
      .select('SUM(market.total_supply_cents)', 'totalSupply')
      .addSelect('SUM(market.total_borrow_cents)', 'totalBorrow');

    if (chainId) {
      qb.where('market.chain_id = :chainId', { chainId });
    }

    const result = await qb.getRawOne<AggregateResult>();
    const supply = BigInt(result?.totalSupply || '0');
    const borrow = BigInt(result?.totalBorrow || '0');
    return supply - borrow;
  }

  async findByName(name: string): Promise<Market | null> {
    this.logger.debug({ name }, 'Finding market by name');
    return this.repository.findOne({ where: { name } });
  }
}
