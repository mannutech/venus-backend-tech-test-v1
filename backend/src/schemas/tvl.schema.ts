import { z } from 'zod';

export const chainIdSchema = z.string().min(1);
export const metricSchema = z.enum(['tvl', 'liquidity']);

export const tvlQuerySchema = z.object({
  chainId: chainIdSchema.optional(),
  metric: metricSchema.default('tvl'),
});

export const marketQuerySchema = z.object({
  name: z.string().min(1),
  metric: metricSchema.default('tvl'),
});

export type ChainId = z.infer<typeof chainIdSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type TvlQueryParams = z.infer<typeof tvlQuerySchema>;
export type MarketQueryParams = z.infer<typeof marketQuerySchema>;
