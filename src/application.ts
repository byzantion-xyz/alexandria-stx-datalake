import { connectWebSocketClient, StacksApiWebSocketClient } from '@stacks/blockchain-api-client';
import { Block, Transaction } from '@stacks/stacks-blockchain-api-types';
import { appConfig } from './common/config/app.config';
import BlockService from './common/services/block.service';
import { AppDataSource } from './database/data-source';
import { Migration } from 'typeorm';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default class Application {
  public connectDB = async (): Promise<void> => {
    try {
      await AppDataSource.initialize();
      console.log('Connected to DB');
    } catch (error) {
      console.error('Could not connect to the database', error);
      throw error;
    }
  };

  public runMigrations = async (): Promise<Migration[]> => {
    try {
      return await AppDataSource.runMigrations();
    } catch (err) {
      console.error('Run migrations failed. Processing stopped.');
      process.exit(1);
    }
  };

  public socketSubscription = async (): Promise<void> => {
    try {
      const blockService = new BlockService();

      const socketUrl = appConfig.stacksWssUrl;
      const client: StacksApiWebSocketClient = await connectWebSocketClient(socketUrl);

      await client.subscribeBlocks(async (event: Block) => {
        console.log(`New block event received with height: ${event.height}`);
        console.log({
          transactions: event.txs.length,
          canonical: event.canonical,
          iso: event.burn_block_time_iso
        });
        if (event.canonical) {
          await delay(20000);
          await blockService.processTipBlock(event);
        }
        console.log('Listening for next block event...');
      });
      console.log(`Subscribed to web socket url ${socketUrl}, listening for next block...`);

      client.subscribeMempool((event: Transaction) => {
        if (event.canonical) {
          console.log(`Transaction ${event.tx_id} added to mempool`);
        }
      });
    } catch (error) {
      console.error('Could not connect to stacks node', error);
      throw error;
    }
  };

  public fetchHistoricalBlocks = async (): Promise<void> => {
    console.log('fetchHistoricalBlocks()');
    try {
      const blockService = new BlockService();

      await blockService.processHistoricalBlocks();
      console.log('fetchHistoricalBlocks() completed');
    } catch (err) {
      console.warn('fetchHistoricalBlocks() failed');
      console.warn(err);
    }
  };

  // public reprocessPastBlocks = async (): Promise<void> => {
  //   console.log('reprocessPastBlocks()');
  //   try {
  //     const blockService = new BlockService();
  //     await blockService.reprocessPastBlocks();
  //     console.log('reprocessPastBlocks() completed');
  //   } catch (err) {
  //     console.warn('reprocessPastBlocks() failed');
  //     console.warn(err);
  //   }
  // };

  public fetchHistoricalSmartContracts = async (): Promise<void> => {
    console.log('fetchHistoricalSmartContracts()');
    try {
      const blockService = new BlockService();

      await blockService.processHistoricSmartContractTxs();
      console.log('fetchHistoricalSmartContracts() completed');
    } catch (err) {
      console.warn('fetchHistoricalSmartContracts() failed');
      console.warn(err);
    }
  };

  public processMostRecentBlockIfIncomplete = async (): Promise<void> => {
    const blockService = new BlockService();
    await blockService.processMostRecentBlockIfIncomplete();
  };

  public setTimerToCheckMostRecentBlock = async (): Promise<void> => {
    try {
      setInterval(
        (_) => this.processMostRecentBlockIfIncomplete(),
        appConfig.missingBlocksTimerInMs
      );

      console.log('setTimerToCheckMostRecentBlock() completed');
    } catch (err) {
      console.warn('setTimerToCheckMostRecentBlock() failed');
      console.error(err);
    }
  };
}
