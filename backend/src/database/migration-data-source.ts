import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { CreateMarketTable1733000000000 } from './migrations/1733000000000-CreateMarketTable';

config();

export const MigrationDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [CreateMarketTable1733000000000],
  migrationsTableName: 'migrations',
});
