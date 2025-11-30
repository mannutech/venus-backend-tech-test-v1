"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tvl_schema_1 = require("../../src/schemas/tvl.schema");
describe('tvlQuerySchema', () => {
    describe('chainId validation', () => {
        it('should accept chainId "1"', () => {
            const result = tvl_schema_1.tvlQuerySchema.safeParse({ chainId: '1' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.chainId).toBe('1');
            }
        });
        it('should accept chainId "56"', () => {
            const result = tvl_schema_1.tvlQuerySchema.safeParse({ chainId: '56' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.chainId).toBe('56');
            }
        });
        it('should accept any non-empty chainId string', () => {
            const result = tvl_schema_1.tvlQuerySchema.safeParse({ chainId: '137' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.chainId).toBe('137');
            }
        });
        it('should allow missing chainId (optional)', () => {
            const result = tvl_schema_1.tvlQuerySchema.safeParse({});
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.chainId).toBeUndefined();
            }
        });
    });
    describe('metric validation', () => {
        it('should accept metric "tvl"', () => {
            const result = tvl_schema_1.tvlQuerySchema.safeParse({ metric: 'tvl' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.metric).toBe('tvl');
            }
        });
        it('should accept metric "liquidity"', () => {
            const result = tvl_schema_1.tvlQuerySchema.safeParse({ metric: 'liquidity' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.metric).toBe('liquidity');
            }
        });
        it('should reject invalid metric', () => {
            const result = tvl_schema_1.tvlQuerySchema.safeParse({ metric: 'invalid' });
            expect(result.success).toBe(false);
        });
        it('should default metric to "tvl" when not provided', () => {
            const result = tvl_schema_1.tvlQuerySchema.safeParse({});
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.metric).toBe('tvl');
            }
        });
    });
    describe('combined validation', () => {
        it('should accept valid chainId and metric together', () => {
            const result = tvl_schema_1.tvlQuerySchema.safeParse({
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
            const result = tvl_schema_1.marketQuerySchema.safeParse({ name: 'Token 01' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.name).toBe('Token 01');
            }
        });
        it('should reject missing name', () => {
            const result = tvl_schema_1.marketQuerySchema.safeParse({});
            expect(result.success).toBe(false);
        });
        it('should reject empty name', () => {
            const result = tvl_schema_1.marketQuerySchema.safeParse({ name: '' });
            expect(result.success).toBe(false);
        });
    });
    describe('metric validation', () => {
        it('should accept metric "tvl"', () => {
            const result = tvl_schema_1.marketQuerySchema.safeParse({
                name: 'Token 01',
                metric: 'tvl',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.metric).toBe('tvl');
            }
        });
        it('should accept metric "liquidity"', () => {
            const result = tvl_schema_1.marketQuerySchema.safeParse({
                name: 'Token 01',
                metric: 'liquidity',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.metric).toBe('liquidity');
            }
        });
        it('should reject invalid metric', () => {
            const result = tvl_schema_1.marketQuerySchema.safeParse({
                name: 'Token 01',
                metric: 'invalid',
            });
            expect(result.success).toBe(false);
        });
        it('should default metric to "tvl" when not provided', () => {
            const result = tvl_schema_1.marketQuerySchema.safeParse({ name: 'Token 01' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.metric).toBe('tvl');
            }
        });
    });
});
