# TVL API

A TypeScript/Express REST API for querying Total Value Locked (TVL) and liquidity metrics across DeFi markets.

## Live Demo

- **API Base URL**: https://venus-backend-tech-test-v1-production.up.railway.app
- **Swagger Documentation**: https://venus-backend-tech-test-v1-production.up.railway.app/api-docs
- **OpenAPI JSON**: https://venus-backend-tech-test-v1-production.up.railway.app/api-docs.json


## Features

- Query total TVL across all markets
- Filter TVL by blockchain chain ID
- Calculate available liquidity (supply - borrow)
- Get detailed market information by name
- OpenAPI/Swagger documentation
- Structured logging with Pino
- Input validation with Zod
- TypeORM with MySQL

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5
- **Framework**: Express.js
- **Database**: MySQL 8 with TypeORM
- **Validation**: Zod
- **Logging**: Pino
- **Testing**: Jest, Supertest
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- Docker & Docker Compose (for containerized setup)

### Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your database credentials:
   ```
   NODE_ENV=development
   PORT=8181
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=app_user
   DB_PASSWORD=your_password
   DB_NAME=app_db
   ```

### Local Development

```bash
# Install dependencies
yarn install

# Run in development mode (with hot reload)
yarn dev

# Build for production
yarn build

# Run production build
yarn start
```

### Docker Setup

```bash
# Start all services (API, MySQL, phpMyAdmin)
docker-compose up --build

# Start in detached mode
docker-compose up -d --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## API Endpoints

### Base URL
- **Production**: `https://venus-backend-tech-test-v1-production.up.railway.app`
- **Local**: `http://localhost:8181`
- **API Version**: `/api/v1`

### Documentation
- **Production Swagger UI**: https://venus-backend-tech-test-v1-production.up.railway.app/api-docs
- **Local Swagger UI**: `http://localhost:8181/api-docs`
- **OpenAPI JSON**: `/api-docs.json`

### Endpoints

#### GET /api/v1/tvl
Get Total Value Locked across all markets.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | string | No | Filter by blockchain chain ID |
| metric | string | No | `tvl` (default) or `liquidity` |

**Examples:**
```bash
# Get total TVL
curl http://localhost:8181/api/v1/tvl

# Get TVL for Ethereum (chain ID 1)
curl http://localhost:8181/api/v1/tvl?chainId=1

# Get liquidity instead of TVL
curl http://localhost:8181/api/v1/tvl?metric=liquidity

# Get liquidity for BSC (chain ID 56)
curl http://localhost:8181/api/v1/tvl?chainId=56&metric=liquidity
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tvl": 728288
  }
}
```

#### GET /api/v1/markets
Get detailed information for a specific market.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Market name to look up |
| metric | string | No | `tvl` (default) or `liquidity` |

**Examples:**
```bash
# Get market details
curl "http://localhost:8181/api/v1/markets?name=Token%2001"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Token 01",
    "chainId": "1",
    "tvl": 10482,
    "liquidity": 4567,
    "totalSupplyCents": 10482,
    "totalBorrowCents": 5915
  }
}
```

### Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "metric",
        "message": "Invalid enum value"
      }
    ]
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Market not found: NonExistent"
  }
}
```

**Internal Server Error (500):**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration (env, logger, swagger)
│   ├── controllers/     # HTTP request handlers
│   ├── database/        # Database connection and data source
│   ├── entities/        # TypeORM entities
│   ├── errors/          # Custom error classes
│   ├── middleware/      # Express middleware
│   ├── repositories/    # Data access layer
│   ├── routes/          # API route definitions
│   ├── schemas/         # Zod validation schemas
│   ├── services/        # Business logic
│   ├── app.ts           # Express app factory
│   └── index.ts         # Application entry point
├── tests/
│   ├── integration/     # API integration tests
│   └── unit/            # Unit tests
├── Dockerfile           # Production Docker image
├── docker-compose.yml   # Multi-service Docker setup
├── jest.config.ts       # Jest configuration
├── tsconfig.json        # TypeScript configuration
└── package.json
```

## Architecture

The application follows a layered architecture with dependency injection:

```
Routes → Controllers → Services → Repositories → Database
                ↓
           Middleware (Validation, Error Handling)
```

- **Controllers**: Handle HTTP concerns, delegate to services
- **Services**: Business logic and calculations
- **Repositories**: Data access abstraction over TypeORM
- **Middleware**: Cross-cutting concerns (validation, error handling, logging)

## Services

### Production (Railway)
| Service | URL |
|---------|-----|
| API | https://venus-backend-tech-test-v1-production.up.railway.app |
| Swagger | https://venus-backend-tech-test-v1-production.up.railway.app/api-docs |

### Local Development
| Service | URL | Description |
|---------|-----|-------------|
| API | http://localhost:8181 | TVL API |
| Swagger | http://localhost:8181/api-docs | API Documentation |
| phpMyAdmin | http://localhost:8080 | Database management UI |
| MySQL | localhost:3306 | Database |

## Development

### Adding a New Endpoint

1. Add validation schema in `src/schemas/`
2. Add service method in `src/services/`
3. Add controller method in `src/controllers/`
4. Add route in `src/routes/`
5. Add OpenAPI documentation as JSDoc comment
6. Write tests (unit + integration)

### Code Style

- Use TypeScript strict mode
- Follow existing patterns for consistency
- Add JSDoc comments for public methods
- Use dependency injection for testability

## Future Improvements

The following enhancements are planned or recommended for production readiness:

### 1. Caching Layer
Currently, every request queries the database. Consider implementing:
- **Redis cache** (recommended for distributed/multi-instance deployments)
  - Cache keys: `tvl:${chainId || 'all'}`, `liquidity:${chainId || 'all'}`
  - TTL: 30-60 seconds for real-time data
- **In-memory cache** (suitable for single-instance deployments)
  - Use `node-cache` or `Map` with TTL

### 2. BigInt Response Handling
Currently using `Number()` conversion for JSON responses:
- `Number.MAX_SAFE_INTEGER` = ~9 quadrillion (safe up to ~$90 trillion in cents)
- Sufficient for current DeFi scale
- If handling raw token amounts (wei/18 decimals), switch to string responses:
  ```typescript
  // Return as string for large numbers
  res.json({ tvl: tvl.toString() })
  ```

### 3. Database Aggregation [DONE]
Implemented SQL `SUM()` aggregation in repository layer for efficient calculations.
- Consider adding database index on `chain_id` for filtered queries

### 4. Additional Features
- **Pagination**: Cursor-based pagination for listing all markets
- **Rate Limiting**: Add at service or middleware level
- **Health Check Endpoint**: `/health` for container orchestration
- **Metrics**: Prometheus metrics for monitoring

## License

Private
