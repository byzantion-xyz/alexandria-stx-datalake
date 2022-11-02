import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import Application from './application';
import { appConfig } from './common/config/app.config';

(async () => {
  try {
    const application = new Application();

    await application.connectDB();

    await application.socketSubscription();

    if (appConfig.streamHistoricalData) {
      await application.fetchHistoricalBlocks();
    } else {
      console.log(
        'Historical data stream disabled. Set ENV variable STREAM_HISTORICAL_DATA=true to enable.'
      );
    }
  } catch (err) {
    console.error(err);
  }
})();
