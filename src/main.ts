import {
  Block,
  connectWebSocketClient,
  StacksApiWebSocketClient
} from '@stacks/blockchain-api-client';

const client: StacksApiWebSocketClient = await connectWebSocketClient(
  'wss://stacks-node-api.mainnet.stacks.co'
);

client.subscribeBlocks((event: Block) => {
  console.log('new block');
  console.log(event);
});

setInterval((_) => {
  console.log('Waiting for new block');
}, 60000);
