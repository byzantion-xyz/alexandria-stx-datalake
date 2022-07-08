import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import Application from './application';
import { appConfig } from './common/config/app.config';

(async () => {
  const application = new Application();

  await application.connectDB();

  await application.socketSubscription();

  if (appConfig.pullHistoricalData) {
    await application.fetchHistoricalBlocks();
  }
})();
