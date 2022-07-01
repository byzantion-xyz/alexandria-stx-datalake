import 'reflect-metadata';

import Application from './application';
import BlockService from './common/services/block.service';

import { AppDataSource } from './database/data-source';

import {
  Block,
  connectWebSocketClient,
  StacksApiWebSocketClient
} from '@stacks/blockchain-api-client';
import { tx_list } from './common/examples/tx_list';
import { block } from './common/examples/block';

(async () => {
  await AppDataSource.initialize();

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
    console.error('Could not connect to stacks node', error);
  }

  //await blockService.processTransactions(tx_list);
  //await blockService.processBlock(block);
})();
