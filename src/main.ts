import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import Application from './application';

(async () => {
  const application = new Application();

  await application.connectDB();

  await application.socketSubscription();
})();
