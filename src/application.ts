import {
  Block,
  connectWebSocketClient,
  StacksApiWebSocketClient
} from '@stacks/blockchain-api-client';
import BlockService from './common/services/block.service';
import { AppDataSource } from './database/data-source';

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

      const client: StacksApiWebSocketClient = await connectWebSocketClient(
        'wss://stacks-node-api.mainnet.stacks.co'
      );

      client.subscribeBlocks((event: Block) => {
        if (event.canonical) {
          console.log(event);
          blockService.processBlock(event);
        }
      });
    } catch (error) {
      console.error('Could not connect to stacks node', error);
      throw error;
    }
  };
}
