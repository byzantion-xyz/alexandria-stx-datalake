import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

import { Transaction } from '../../database/entities/Transaction';
import { Block } from '../../database/entities/Block';

import type {
  Block as StacksBlock,
  TransactionFound,
  TransactionList,
  BlockListResponse,
  TransactionNotFound,
  TransactionEvent
} from '@stacks/stacks-blockchain-api-types';
import { AppDataSource } from '../../database/data-source';
import { appConfig } from '../config/app.config';
import { GetBlockByHeightRequest } from '@stacks/blockchain-api-client';

type GetTransactionsResponse = {
  data: TransactionList;
};

type GetEventsResponse = {
  data: TransactionEvent[];
};

const RETRIES_PER_BLOCK = 10;
const EVENT_LIMIT_DEFAULT = 96;
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
      const limit = 200;
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
          if (tx.tx_status === 'success' && tx.canonical) {
            const txJSON = JSON.parse(JSON.stringify(tx));
            if (tx.event_count > EVENT_LIMIT_DEFAULT) {
              txJSON.events = await this.fetchTransactionEvents(tx.tx_id);
            }

            const transaction = new Transaction();
            transaction.hash = tx.tx_id;
            transaction.tx = txJSON;
            transaction.contract_id = tx[tx.tx_type].contract_id;
            tx_batch.push(transaction);
          }
        }

        try {
          if (tx_batch.length) {
            await AppDataSource.manager.save(tx_batch);
            tx_batch = [];
          }

          if (!result.data?.results || !result.data.results.length) {
            break;
          }
        } catch (err) {
          throw err;
        }

        console.log(`[processHistoricSmartContractTxs] ${limit + offset} txs completed.`);
        offset += limit;
      }
    } catch (err) {
      console.error(`Failed to process historical smart_contract txs`);
    }
  };

  public fetchTransactionEvents = async (hash: string): Promise<TransactionEvent[]> => {
    try {
      let events: TransactionEvent[] = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const url = new URL(
          `${appConfig.stacksNodeApiUrl}extended/v1/tx/events?tx_id=${hash}&limit=${limit}&offset=${offset}`
        );
        const result: AxiosResponse = await axios.get<GetEventsResponse>(url.href, axiosOptions);

        if (!result.data?.events || !result.data.events.length) {
          break;
        } else {
          events.push(...result.data.events);
        }

        offset += limit;
      }

      events = events.sort((a, b) => a.event_index - b.event_index);

      return events;
    } catch (err) {
      console.error(`Failed to fetch events for transaction`);
      throw err;
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
        const txJSON = JSON.parse(JSON.stringify(tx));
        if (tx.event_count > EVENT_LIMIT_DEFAULT) {
          txJSON.events = await this.fetchTransactionEvents(tx.tx_id);
        }

        const transaction = new Transaction();
        transaction.hash = tx.tx_id;
        transaction.tx = txJSON;
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


  public fetchBlocksStatus = async (retry = 0): Promise<BlockListResponse> => {
    try {
      const recentBlockUrl = `${appConfig.stacksNodeApiUrl}extended/v1/block?limit=1`;
      const result: AxiosResponse = await axios.get(recentBlockUrl, axiosOptions);
      const data: BlockListResponse = result.data;

      return data;
    } catch (err) {
      console.warn(`fetchBlocksStatus() failed`);
      if (retry < RETRIES_PER_BLOCK) {
        retry++;
        await delay(2000);
        return await this.fetchBlocksStatus(retry);
      } else {
        console.warn(`fetchBlockStatus() failed. Maximum number of retries reached`);
        throw err;
      }
    }

  }

  public processHistoricalBlocks = async (): Promise<void> => {
    const blockStatus: BlockListResponse = await this.fetchBlocksStatus();
    const totalBlocks = blockStatus.total;

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

  public checkRecentBlockStatus = async (): Promise<void> => {
    const blockList = await this.fetchBlocksStatus();
    const latestBlockHeight = blockList.total;
    const blocks = await AppDataSource.manager.query(
      `select * from block where height = ${latestBlockHeight}`
    );

    if (!blocks || !blocks.length) {
      const block = await this.fetchBlock(latestBlockHeight);
      if (block) {
        await this.processTipBlock(block);
      }
    }
  }
}
