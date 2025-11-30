import { Request, Response, NextFunction } from 'express';
import { MarketService } from '../services/market.service';
import type { TvlQueryParams, MarketQueryParams } from '../schemas/tvl.schema';
import type { Logger } from '../config/logger.config';

export class TvlController {
  constructor(
    private readonly marketService: MarketService,
    private readonly logger: Logger
  ) {}

  getTvl = async (
    req: Request<unknown, unknown, unknown, TvlQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { chainId, metric } = req.query;
      this.logger.debug({ chainId, metric }, 'GET /tvl request');

      if (metric === 'liquidity') {
        const liquidity = await this.marketService.getLiquidity(chainId);
        res.json({
          success: true,
          data: {
            liquidity,
            currency: 'cents',
            ...(chainId && { filters: { chainId } }),
          },
        });
        return;
      }

      const tvl = await this.marketService.getTvl(chainId);
      res.json({
        success: true,
        data: {
          tvl,
          currency: 'cents',
          ...(chainId && { filters: { chainId } }),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getMarket = async (
    req: Request<unknown, unknown, unknown, MarketQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name } = req.query;
      this.logger.debug({ name }, 'GET /markets request');
      const market = await this.marketService.getMarket(name);

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
    } catch (error) {
      next(error);
    }
  };
}
