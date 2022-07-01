import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Transaction } from './entities/Transaction';
import { Block } from './entities/Block';
import { appConfig } from '../common/config/app.config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [Transaction, Block],
  migrations: [],
  subscribers: [],
  migrationsTableName: '_migrations'
});
