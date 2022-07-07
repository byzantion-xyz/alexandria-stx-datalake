import dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
  databaseUrl: process.env.DATABASE_URL,
  environment: process.env.NODE_ENV,
  stacksNodeApiUrl: process.env.STACKS_NODE_API_URL || 'https://stacks-node-api.mainnet.stacks.co/'
};
