import { AxiosResponse } from 'axios';
import axios from 'axios';

import type {
  Block as StacksBlock,
  MempoolTransaction,
  Transaction as StacksTransaction,
  TransactionFound,
  TransactionList,
  TransactionNotFound
} from '@stacks/stacks-blockchain-api-types';

type GetTransactionsResponse = {
  data: TransactionList;
};

export default class BlockService {
  public processBlock = async (block: StacksBlock): Promise<void> => {
    console.log(block);

    if (block.txs.length <= 200) {
      let url = new URL(`https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/multiple`);

      for (let tx_hash of block.txs) {
        url.searchParams.append('tx_id', tx_hash);
      }

      const result: AxiosResponse = await axios.get<GetTransactionsResponse>(url.href);
      const txs: TransactionList = result.data;

      await this.processTransactions(txs);
    }
  };

  public processTransactions = async (txs: TransactionList): Promise<void> => {
    let batch = [];

    for (let tx_hash of Object.keys(txs)) {
      let tx_result = txs[tx_hash];

      if (tx_result?.found) {
        let tx: StacksTransaction | MempoolTransaction = tx_result.result;
      }
    }
  };
}
