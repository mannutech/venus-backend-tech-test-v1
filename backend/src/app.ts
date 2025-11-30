import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { Repository } from 'typeorm';
import { Market } from './entities/market.entity';
import { MarketRepository } from './repositories/market.repository';
import { MarketService } from './services/market.service';
import { TvlController } from './controllers/tvl.controller';
import { createTvlRouter } from './routes/tvl.routes';
import { createErrorHandler } from './middleware/error-handler.middleware';
import { swaggerSpec } from './config/swagger.config';
import type { Logger } from './config/logger.config';

interface AppDependencies {
  marketEntityRepository: Repository<Market>;
  logger: Logger;
}

export function createApp({ marketEntityRepository, logger }: AppDependencies): Express {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Dependencies
  const marketRepository = new MarketRepository(marketEntityRepository, logger);
  const marketService = new MarketService(marketRepository, logger);
  const tvlController = new TvlController(marketService, logger);

  // API Documentation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use('/api-docs', swaggerUi.serve as any, swaggerUi.setup(swaggerSpec) as any);
  app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

  // Routes
  app.use('/api/v1', createTvlRouter(tvlController));

  // Error handler (must be last)
  app.use(createErrorHandler(logger));

  return app;
}
