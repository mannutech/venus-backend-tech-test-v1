import { Repository } from 'typeorm';
import { Market } from '../entities/market.entity';
import type { ChainId } from '../schemas/tvl.schema';
import type { Logger } from '../config/logger.config';

export class MarketRepository {
  constructor(
    private readonly repository: Repository<Market>,
    private readonly logger: Logger
  ) {}

  /**
   * Fetches all markets, optionally filtered by chainId.
   *
   * TODO: Implement pagination for large datasets
   * - Add `page` and `limit` parameters
   * - Return { data: Market[], total: number, page: number, limit: number }
   * - Use repository.findAndCount() for total count
   * - Example: findAll(chainId, { page: 1, limit: 100 })
   */
  async findAll(chainId?: ChainId): Promise<Market[]> {
    this.logger.debug({ chainId }, 'Finding all markets');
    if (chainId) {
      return this.repository.find({ where: { chainId } });
    }
    return this.repository.find();
  }

  async findByName(name: string): Promise<Market | null> {
    this.logger.debug({ name }, 'Finding market by name');
    return this.repository.findOne({ where: { name } });
  }
}
