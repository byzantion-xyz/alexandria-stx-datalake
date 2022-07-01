import { AxiosResponse } from 'axios';
import axios from 'axios';

import { Transaction } from '../../database/entities/Transaction';
import { Block } from '../../database/entities/Block';

import type {
  Block as StacksBlock,
  ContractCallTransaction,
  MempoolTransaction,
  Transaction as StacksTransaction,
  TransactionFound,
  TransactionList,
  TransactionNotFound
} from '@stacks/stacks-blockchain-api-types';
import { AppDataSource } from '../../database/data-source';

type GetTransactionsResponse = {
  data: TransactionList;
};

export default class BlockService {
  public processBlock = async (block: StacksBlock): Promise<void> => {
    try {
      const txsLength = block.txs.length;
      const querySize = 50;

      for (let i = 0; i < txsLength; i += querySize) {
        const url = new URL(`https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/multiple`);

        for (const tx_hash of block.txs.slice(i, i + querySize)) {
          url.searchParams.append('tx_id', tx_hash);
        }

        const result: AxiosResponse = await axios.get<GetTransactionsResponse>(url.href);
        const txs: TransactionList = result.data;

        await this.processTransactions(txs);
      }

      const newBlock: Block = new Block();
      newBlock.hash = block.hash;
      newBlock.height = block.height;
      newBlock.timestamp = new Date(block.burn_block_time_iso);
      await AppDataSource.manager.save(newBlock);
    } catch (err) {
      console.error(`Failed to process block height: ${block.height}`);
      console.error(err);
    }
  };

  public processTransactions = async (txs: TransactionList): Promise<void> => {
    const tx_batch: Transaction[] = [];
    for (const tx_hash of Object.keys(txs)) {
      const tx_result: TransactionFound | TransactionNotFound | undefined = txs[tx_hash];

      if (
        tx_result?.found &&
        tx_result.result.tx_type === 'contract_call' &&
        tx_result.result.tx_status === 'success'
      ) {
        const tx: ContractCallTransaction = tx_result?.result;
        const transaction = new Transaction();
        transaction.hash = tx.tx_id;
        transaction.tx = JSON.parse(JSON.stringify(tx));
        transaction.contract_id = tx.contract_call.contract_id;
        transaction.block_height = tx.block_height;
        tx_batch.push(transaction);
      }
    }

    try {
      if (tx_batch.length) {
        await AppDataSource.manager.save(tx_batch);
      }
    } catch (err) {
      console.error(err);
    }
  };
}
