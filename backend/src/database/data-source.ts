import { DataSource } from 'typeorm';
import { Market } from '../entities/market.entity';
import { getEnvConfig } from '../config/env.config';

export function createDataSource(): DataSource {
  const config = getEnvConfig();

  return new DataSource({
    type: 'mysql',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: [Market],
    synchronize: false,
    logging: config.NODE_ENV === 'development',
    // Connection pooling for better performance under load
    extra: {
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0,
    },
  });
}

let dataSource: DataSource | null = null;

export function getDataSource(): DataSource {
  if (!dataSource) {
    dataSource = createDataSource();
  }
  return dataSource;
}
