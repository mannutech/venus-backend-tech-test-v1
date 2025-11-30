import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TVL API',
      version: '1.0.0',
      description: 'API for querying Total Value Locked (TVL) and liquidity metrics across DeFi markets',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                message: {
                  type: 'string',
                  example: 'Invalid request parameters',
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        TvlResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                tvl: {
                  type: 'number',
                  description: 'Total Value Locked in cents',
                  example: 728288,
                },
              },
            },
          },
        },
        LiquidityResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                liquidity: {
                  type: 'number',
                  description: 'Available liquidity (supply - borrow) in cents',
                  example: 340005,
                },
              },
            },
          },
        },
        MarketResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  example: 1,
                },
                name: {
                  type: 'string',
                  example: 'Token 01',
                },
                chainId: {
                  type: 'string',
                  example: '1',
                },
                tvl: {
                  type: 'number',
                  description: 'Total Value Locked in cents',
                  example: 10482,
                },
                liquidity: {
                  type: 'number',
                  description: 'Available liquidity in cents',
                  example: 4567,
                },
                totalSupplyCents: {
                  type: 'number',
                  example: 10482,
                },
                totalBorrowCents: {
                  type: 'number',
                  example: 5915,
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
