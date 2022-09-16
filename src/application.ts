import {
  Block,
  connectWebSocketClient,
  StacksApiWebSocketClient
} from '@stacks/blockchain-api-client';
import BlockService from './common/services/block.service';
import { AppDataSource } from './database/data-source';
import { appConfig } from './common/config/app.config';

export default class Application {
  public connectDB = async (): Promise<void> => {
    try {
      await AppDataSource.initialize();
      console.log('Connected to DB');
    } catch (error) {
      console.error('Could not connect to the database', error);
      throw error;
    }
  };

  public socketSubscription = async (): Promise<void> => {
    try {
      const blockService = new BlockService();

      const socketUrl = appConfig.stacksWssUrl;
      const client: StacksApiWebSocketClient = await connectWebSocketClient(socketUrl);

      await client.subscribeBlocks(async (event: Block) => {
        if (event.canonical) {
          console.log(event);
          await blockService.processBlock(event);
          console.log('Listening for next block event...');
        }
      });
      console.log(`Subscribed to web socket url ${socketUrl}, listening for next block...`);
    } catch (error) {
      console.error('Could not connect to stacks node', error);
      throw error;
    }
  };

  public fetchHistoricalBlocks = async (): Promise<void> => {
    console.log('fetchHistoricalBlocks()');
    try {
      const blockService = new BlockService();

      await blockService.processHistoricalBlocks();
      console.log('fetchHistoricalBlocks() completed');
    } catch (err) {
      console.warn('fetchHistoricalBlocks() failed');
      console.warn(err);
    }
  };
}
