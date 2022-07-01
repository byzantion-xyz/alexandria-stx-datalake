import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EntityManager, MikroORM } from '@mikro-orm/core';

import { Transaction } from './common/entities/transaction.entity';
import { Block } from './common/entities/block.entity';

export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
};

export default class Application {
  public connectDB = async (): Promise<void> => {
    try {
      DI.orm = await MikroORM.init<PostgreSqlDriver>({
        discovery: {
          warnWhenNoEntities: true
        },
        allowGlobalContext: true,
        tsNode: process.env.NODE_DEV === 'development' ? true : false,
        type: 'postgresql',
        user: 'universal-staging-user',
        password: 'RpyHOdJXH6AyxkNUzz',
        host: '34.168.241.120',
        port: 5432,
        dbName: 'byz-universal-postgres-staging',
        entities: [Transaction, Block],
        entitiesTs: ['./common/entities']
        /*migrations: {
          path: './src/migrations',
          tableName: 'migrations',
          transactional: true,
        },*/
      });
      DI.em = DI.orm.em;
      console.log('Connected to DB');
    } catch (error) {
      console.error('Could not connect to the database', error);
    }
  };
}
