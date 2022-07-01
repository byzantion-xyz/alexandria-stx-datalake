import Application from './application';

import BlockService from './common/services/block.service';

import {
  Block,
  connectWebSocketClient,
  StacksApiWebSocketClient
} from '@stacks/blockchain-api-client';
import { tx_list } from './common/examples/tx_list';

(async () => {
  const application = new Application();
  await application.connectDB();

  const blockService = new BlockService();

  try {
    const client: StacksApiWebSocketClient = await connectWebSocketClient(
      'wss://stacks-node-api.mainnet.stacks.co'
    );

    client.subscribeBlocks((event: Block) => {
      console.log(event);
      blockService.processBlock(event);
    });
  } catch (error) {
    console.error('Could not start server', error);
  }
})();
