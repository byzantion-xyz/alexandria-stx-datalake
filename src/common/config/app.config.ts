import dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
  databaseUrl: process.env.DATABASE_URL,
  environment: process.env.NODE_ENV,
  stacksNodeApiUrl: process.env.STACKS_NODE_API_URL || 'https://stacks-node-api.mainnet.stacks.co/',
  stacksWssUrl: process.env.STACKS_WSS_URL || 'wss://stacks-node-api.mainnet.stacks.co',
  streamHistoricalData: process.env.STREAM_HISTORICAL_DATA === 'true' || false,
  enableMissingBlocksTimer: process.env.ENABLE_MISSING_BLOCKS_TIMER === 'true' || false,
  fetchHistoricalSmartContracts: true,
  missingBlocksTimerInMs: 20 * 60 * 1000,
  pastBlocksToProcess1: [76922]
};