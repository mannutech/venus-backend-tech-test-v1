import { Router } from 'express';
import { TvlController } from '../controllers/tvl.controller';
import { validateQuery } from '../middleware/validate.middleware';
import { tvlQuerySchema, marketQuerySchema } from '../schemas/tvl.schema';

export function createTvlRouter(controller: TvlController): Router {
  const router = Router();

  /**
   * @openapi
   * /tvl:
   *   get:
   *     summary: Get Total Value Locked (TVL) or Liquidity
   *     description: Returns the sum of total supply (TVL) or available liquidity across all markets, optionally filtered by chain ID
   *     tags:
   *       - TVL
   *     parameters:
   *       - in: query
   *         name: chainId
   *         schema:
   *           type: string
   *         description: Filter by blockchain chain ID (e.g., "1" for Ethereum, "56" for BSC)
   *         example: "1"
   *       - in: query
   *         name: metric
   *         schema:
   *           type: string
   *           enum: [tvl, liquidity]
   *           default: tvl
   *         description: Metric to return - "tvl" for total supply, "liquidity" for supply minus borrows
   *     responses:
   *       200:
   *         description: Successful response with TVL or liquidity data
   *         content:
   *           application/json:
   *             schema:
   *               oneOf:
   *                 - $ref: '#/components/schemas/TvlResponse'
   *                 - $ref: '#/components/schemas/LiquidityResponse'
   *             examples:
   *               tvl:
   *                 summary: TVL response
   *                 value:
   *                   success: true
   *                   data:
   *                     tvl: 63949
   *                     currency: "cents"
   *               tvlFiltered:
   *                 summary: TVL filtered by chainId
   *                 value:
   *                   success: true
   *                   data:
   *                     tvl: 30941
   *                     currency: "cents"
   *                     filters:
   *                       chainId: "1"
   *               liquidity:
   *                 summary: Liquidity response
   *                 value:
   *                   success: true
   *                   data:
   *                     liquidity: 38231
   *                     currency: "cents"
   *       400:
   *         description: Invalid request parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               error:
   *                 code: "VALIDATION_ERROR"
   *                 message: "Invalid request parameters"
   *                 details:
   *                   - field: "metric"
   *                     message: "Invalid enum value"
   */
  router.get('/tvl', validateQuery(tvlQuerySchema), controller.getTvl);

  /**
   * @openapi
   * /markets:
   *   get:
   *     summary: Get market details by name
   *     description: Returns detailed information for a specific market including TVL, liquidity, and supply/borrow data
   *     tags:
   *       - Markets
   *     parameters:
   *       - in: query
   *         name: name
   *         required: true
   *         schema:
   *           type: string
   *         description: The name of the market to retrieve
   *         example: "Token 01"
   *       - in: query
   *         name: metric
   *         schema:
   *           type: string
   *           enum: [tvl, liquidity]
   *           default: tvl
   *         description: Optional metric filter (currently returns all metrics regardless)
   *     responses:
   *       200:
   *         description: Successful response with market data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MarketResponse'
   *             example:
   *               success: true
   *               data:
   *                 id: 1
   *                 name: "Token 01"
   *                 chainId: "1"
   *                 tvl: 10482
   *                 liquidity: 4567
   *                 totalSupplyCents: 10482
   *                 totalBorrowCents: 5915
   *                 currency: "cents"
   *       400:
   *         description: Invalid request parameters (missing or empty name)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               error:
   *                 code: "VALIDATION_ERROR"
   *                 message: "Invalid request parameters"
   *                 details:
   *                   - field: "name"
   *                     message: "Required"
   *       404:
   *         description: Market not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               error:
   *                 code: "NOT_FOUND"
   *                 message: "Market not found: NonExistent"
   */
  router.get('/markets', validateQuery(marketQuerySchema), controller.getMarket);

  return router;
}
