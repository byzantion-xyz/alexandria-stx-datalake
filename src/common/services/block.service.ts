import { AxiosResponse } from 'axios';
import axios from 'axios';

import { Transaction } from '../../database/entities/Transaction';
import { Block } from '../../database/entities/Block';

import type {
  Block as StacksBlock,
  MempoolTransaction,
  Transaction as StacksTransaction,
  TransactionFound,
  TransactionList,
  TransactionNotFound
} from '@stacks/stacks-blockchain-api-types';
import { AppDataSource } from '../../database/data-source';
import { TransactionResultsToJSON } from '@stacks/blockchain-api-client';

type GetTransactionsResponse = {
  data: TransactionList;
};

export default class BlockService {
  public processBlock = async (block: StacksBlock): Promise<void> => {
    console.log(block);

    const txsLength = block.txs.length;

    for (let i = 0; i <= txsLength; i += 100) {
      let url = new URL(`https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/multiple`);

      for (let tx_hash of block.txs.slice(i, i + 100)) {
        url.searchParams.append('tx_id', tx_hash);
      }
      const result: AxiosResponse = await axios.get<GetTransactionsResponse>(url.href);
      const txs: TransactionList = result.data;

      await this.processTransactions(txs);
    }
  };

  public processTransactions = async (txs: TransactionList): Promise<void> => {
    let tx_batch: Transaction[] = [];
    for (let tx_hash of Object.keys(txs)) {
      let tx_result: TransactionFound | TransactionNotFound | undefined = txs[tx_hash];

      if (tx_result?.found) {
        let tx: StacksTransaction | MempoolTransaction = tx_result?.result;
        let transaction = new Transaction();
        transaction.hash = tx.tx_id;
        transaction.tx = JSON.parse(JSON.stringify(tx));
        tx_batch.push(transaction);
      }
    }

    try {
      await AppDataSource.manager.save(tx_batch);
    } catch (err) {
      console.error(err);
    }
  };
}
