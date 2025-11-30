import 'reflect-metadata';
import dotenv from 'dotenv';
import { loadEnvConfig } from './config/env.config';
import { createLogger } from './config/logger.config';
import { getDataSource } from './database/data-source';
import { createApp } from './app';
import { Market } from './entities/market.entity';

dotenv.config();

const logger = createLogger();

async function bootstrap(): Promise<void> {
  const config = loadEnvConfig();
  logger.info({ nodeEnv: config.NODE_ENV }, 'Starting application');

  const dataSource = getDataSource();
  await dataSource.initialize();
  logger.info({ host: config.DB_HOST, database: config.DB_NAME }, 'Database connected');

  const marketEntityRepository = dataSource.getRepository(Market);
  const app = createApp({ marketEntityRepository, logger });

  app.listen(config.PORT, () => {
    logger.info({ port: config.PORT }, 'Server started');
  });
}

bootstrap().catch((error) => {
  logger.fatal({ err: error }, 'Failed to start server');
  process.exit(1);
});
