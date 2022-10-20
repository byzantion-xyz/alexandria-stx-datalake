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
  TransactionNotFound,
  AbstractTransaction
} from '@stacks/stacks-blockchain-api-types';
import { AppDataSource } from '../../database/data-source';
import { appConfig } from '../config/app.config';
import { GetBlockByHeightRequest } from '@stacks/blockchain-api-client';

type GetTransactionsResponse = {
  data: TransactionList;
};

const RETRIES_PER_BLOCK = 10;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const axiosOptions: AxiosRequestConfig = { timeout: 15000 };

export default class BlockService {
  public processTipBlock = async (block: StacksBlock): Promise<void> => {
    await this.processBlock(block);
    const previousBlocks: number[] = [
      block.height - 4,
      block.height - 3,
      block.height - 2,
      block.height - 1
    ];
    await this.reprocessPastBlocks(previousBlocks);
    console.log(
      `COMPLETED processing block ${block.height} -- including ${previousBlocks.length} previous blocks.`
    );
  };

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

        await this.processTransactions(txs, block.height);
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
      // console.error(err);
      if (retry < RETRIES_PER_BLOCK) {
        retry++;
        await delay(2000);
        await this.processBlock(block, retry);
      } else {
        console.error(err);
        console.warn(
          `processBlock() height: ${block.height} failed. Maximum number of retries reached`
        );
      }
    }
  };

  public processHistoricSmartContractTxs = async (): Promise<void> => {
    try {
      let offset = 8000;
      let limit = 200;
      let tx_batch: Transaction[] = [];
      while (true) {
        const url = new URL(
          `${appConfig.stacksNodeApiUrl}extended/v1/tx?type=smart_contract&limit=${limit}&offset=${offset}`
        );
        const result: AxiosResponse = await axios.get<GetTransactionsResponse>(
          url.href,
          axiosOptions
        );

        for (const tx of result.data.results) {
          if (tx.tx_status === 'success') {
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
            tx_batch = [];
          } else {
            break;
          }
        } catch (err) {
          console.error(err);
          throw err;
        }

        console.log(`[processHistoricSmartContractTxs] ${limit + offset} txs completed.`);
        offset += limit;
      }
    } catch (err) {
      console.error(`Failed to process historical smart_contract txs`);
    }
  };

  public processTransactions = async (txs: TransactionList, blockHeight: number): Promise<void> => {
    const tx_batch: Transaction[] = [];
    for (const tx_hash of Object.keys(txs)) {
      const tx_result: TransactionFound | TransactionNotFound | undefined = txs[tx_hash];

      if (
        tx_result?.found &&
        ['contract_call', 'smart_contract'].includes(tx_result.result.tx_type) &&
        tx_result.result.tx_status === 'success' &&
        tx_result.result.canonical
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
      console.log(`processTransactions() block: ${blockHeight}, txs saved: ${tx_batch.length}`);
    } catch (err) {
      console.error(err);
      throw err;
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

  public reprocessPastBlocks = async (blocks: Array<number>): Promise<void> => {
    if (blocks) {
      console.log(`reprocessPastBlocks() Reprocessing ${blocks.length} blocks`);
      for (const blockNum of blocks) {
        await AppDataSource.manager.delete(Block, { height: blockNum });
        const block = await this.fetchBlock(blockNum);
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
