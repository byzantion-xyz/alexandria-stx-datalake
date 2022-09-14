import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

import { Transaction } from '../../database/entities/Transaction';
import { Block } from '../../database/entities/Block';

import type {
  Block as StacksBlock,
  ContractCallTransaction,
  TransactionFound,
  TransactionList,
  BlockListResponse,
  TransactionNotFound
} from '@stacks/stacks-blockchain-api-types';
import { AppDataSource } from '../../database/data-source';
import { appConfig } from '../config/app.config';
import { GetBlockByHeightRequest } from '@stacks/blockchain-api-client';

type GetTransactionsResponse = {
  data: TransactionList;
};

const RETRIES_PER_BLOCK = 2;

const axiosOptions: AxiosRequestConfig = { timeout: 15000 };

export default class BlockService {
  public processBlock = async (block: StacksBlock, retry = 0): Promise<void> => {
    try {
      const txsLength = block.txs.length;
      const querySize = 50;
      console.log(
        `Processing block height: ${block.height} transactions: ${txsLength} ` +
          `${retry > 0 ? 'retry: ' + retry : ''}`
      );

      for (let i = 0; i < txsLength; i += querySize) {
        const url = new URL(`${appConfig.stacksNodeApiUrl}extended/v1/tx/multiple`);

        for (const tx_hash of block.txs.slice(i, i + querySize)) {
          url.searchParams.append('tx_id', tx_hash);
        }

        const result: AxiosResponse = await axios.get<GetTransactionsResponse>(
          url.href,
          axiosOptions
        );
        const txs: TransactionList = result.data;

        await this.processTransactions(txs);
      }

      const newBlock: Block = new Block();
      newBlock.hash = block.hash;
      newBlock.height = block.height;
      newBlock.timestamp = new Date(block.burn_block_time_iso);
      newBlock.block = JSON.parse(JSON.stringify(block));

      await AppDataSource.manager.save(newBlock);

      console.log(`Processed block height: ${block.height}`);
    } catch (err) {
      console.error(`Failed to process block height: ${block.height}`);
      console.error(err);
      if (retry < RETRIES_PER_BLOCK) {
        retry++;
        await this.processBlock(block, retry);
      } else {
        console.warn(
          `processBlock() height: ${block.height} failed. Maximum number of retries reached`
        );
      }
    }
  };

  public processTransactions = async (txs: TransactionList): Promise<void> => {
    const tx_batch: Transaction[] = [];
    for (const tx_hash of Object.keys(txs)) {
      const tx_result: TransactionFound | TransactionNotFound | undefined = txs[tx_hash];

      if (
        tx_result?.found &&
        ['contract_call', 'smart_contract'].includes(tx_result.result.tx_type) &&
        tx_result.result.tx_status === 'success'
      ) {
        const tx: any = tx_result?.result;
        const transaction = new Transaction();
        transaction.hash = tx.tx_id;
        transaction.tx = JSON.parse(JSON.stringify(tx));
        transaction.contract_id = tx[tx.tx_type].contract_id;
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

  public processHistoricalBlocks = async (): Promise<void> => {
    const recentBlockUrl = `${appConfig.stacksNodeApiUrl}extended/v1/block?limit=1`;
    const result: AxiosResponse = await axios.get(recentBlockUrl, axiosOptions);
    const data: BlockListResponse = result.data;
    const totalBlocks = data.total;

    const processedBlockHeights = await AppDataSource.manager.query(
      'select array(select block.height::int from block);'
    );
    const arrBlockHeights = processedBlockHeights[0].array;
    const missingBlocks = totalBlocks - arrBlockHeights.length;
    console.log(`fetchHistoricalBlocks() Total blocks: ${totalBlocks}  Missing: ${missingBlocks}`);

    for (let i = 1; i <= totalBlocks; i++) {
      if (!arrBlockHeights.includes(i)) {
        const block = await this.fetchBlock(i);
        if (block) await this.processBlock(block);
      }
    }
  };

  public fetchBlock = async (height: number, retry = 0): Promise<StacksBlock | undefined> => {
    try {
      console.log(
        `fetchBlock() Querying block height: ${height} ${retry > 0 ? 'retry: ' + retry : ''}`
      );
      const blockPath = `${appConfig.stacksNodeApiUrl}extended/v1/block/by_height/${height}`;
      const result: AxiosResponse = await axios.get<GetBlockByHeightRequest>(
        blockPath,
        axiosOptions
      );
      const block: StacksBlock = result.data;

      return block;
    } catch (err) {
      console.warn(`fetchBlock() height: ${height} failed`);
      if (retry < RETRIES_PER_BLOCK) {
        retry++;
        return await this.fetchBlock(height, retry);
      } else {
        console.warn(`fetchBlock() height: ${height} failed. Maximum number of retries reached`);
      }
    }
  };
}
