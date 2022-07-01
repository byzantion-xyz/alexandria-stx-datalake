import { Block } from '@stacks/stacks-blockchain-api-types';

export const block: Block = {
  canonical: false,
  height: 0,
  hash: '',
  parent_block_hash: '',
  burn_block_time: 0,
  burn_block_time_iso: '',
  burn_block_hash: '',
  burn_block_height: 0,
  miner_txid: '',
  parent_microblock_hash: '',
  parent_microblock_sequence: 0,
  txs: [
    '0x63d19d332755a87bfb7003a2ca034362873a360f6cf2b01de27d030ff6b1d71f',
    '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30'
  ],
  microblocks_accepted: [],
  microblocks_streamed: [],
  execution_cost_read_count: 0,
  execution_cost_read_length: 0,
  execution_cost_runtime: 0,
  execution_cost_write_count: 0,
  execution_cost_write_length: 0
};
