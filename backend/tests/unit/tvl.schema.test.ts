import {
  tvlQuerySchema,
  marketQuerySchema,
  TvlQueryParams,
  MarketQueryParams,
} from '../../src/schemas/tvl.schema';

describe('tvlQuerySchema', () => {
  describe('chainId validation', () => {
    it('should accept chainId "1"', () => {
      const result = tvlQuerySchema.safeParse({ chainId: '1' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.chainId).toBe('1');
      }
    });

    it('should accept chainId "56"', () => {
      const result = tvlQuerySchema.safeParse({ chainId: '56' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.chainId).toBe('56');
      }
    });

    it('should accept any non-empty chainId string', () => {
      const result = tvlQuerySchema.safeParse({ chainId: '137' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.chainId).toBe('137');
      }
    });

    it('should allow missing chainId (optional)', () => {
      const result = tvlQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.chainId).toBeUndefined();
      }
    });
  });

  describe('metric validation', () => {
    it('should accept metric "tvl"', () => {
      const result = tvlQuerySchema.safeParse({ metric: 'tvl' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metric).toBe('tvl');
      }
    });

    it('should accept metric "liquidity"', () => {
      const result = tvlQuerySchema.safeParse({ metric: 'liquidity' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metric).toBe('liquidity');
      }
    });

    it('should reject invalid metric', () => {
      const result = tvlQuerySchema.safeParse({ metric: 'invalid' });
      expect(result.success).toBe(false);
    });

    it('should default metric to "tvl" when not provided', () => {
      const result = tvlQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metric).toBe('tvl');
      }
    });
  });

  describe('combined validation', () => {
    it('should accept valid chainId and metric together', () => {
      const result = tvlQuerySchema.safeParse({
        chainId: '1',
        metric: 'liquidity',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.chainId).toBe('1');
        expect(result.data.metric).toBe('liquidity');
      }
    });
  });
});

describe('marketQuerySchema', () => {
  describe('name validation', () => {
    it('should accept a valid name', () => {
      const result = marketQuerySchema.safeParse({ name: 'Token 01' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Token 01');
      }
    });

    it('should reject missing name', () => {
      const result = marketQuerySchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const result = marketQuerySchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('metric validation', () => {
    it('should accept metric "tvl"', () => {
      const result = marketQuerySchema.safeParse({
        name: 'Token 01',
        metric: 'tvl',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metric).toBe('tvl');
      }
    });

    it('should accept metric "liquidity"', () => {
      const result = marketQuerySchema.safeParse({
        name: 'Token 01',
        metric: 'liquidity',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metric).toBe('liquidity');
      }
    });

    it('should reject invalid metric', () => {
      const result = marketQuerySchema.safeParse({
        name: 'Token 01',
        metric: 'invalid',
      });
      expect(result.success).toBe(false);
    });

    it('should default metric to "tvl" when not provided', () => {
      const result = marketQuerySchema.safeParse({ name: 'Token 01' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metric).toBe('tvl');
      }
    });
  });
});
