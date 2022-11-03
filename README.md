# Alexandria STX Data Lake

## Overview

The Alexandria Indexer is a system of layered services that index the data stored on the Stacks blockchain, equipping builders with transaction, event and NFT-state data on which they can build their applications.

The first layer of the Alexandria Indexer is the STX Data Lake. It streams raw transactions from the Stacks Node, extracting all on-chain transactions into the data lake database into the data lake schema, making the transactions available and more accessible for further indexing at a higher level, and enabling reindexing over time without the dependency of a Stacks Node.

The Alexandria Stacks TX Data Lake consists of 2 key components:

1. A PostgreSQL database that stores Stacks chain block and transaction data
2. A streamer service that connects to a designated Stacks API Node and streams the data into the database

## Setup

To set up the Data Lake and Streamer Service, follow the steps below. You can also watch starlord walking you through the setup in the following video https://www.loom.com/share/2fa9279e8aa64e34bb4c128b77fbd204

### 1. Database

- Ensure that you have a PostgreSQL database instance up and running
- Create a database on your instance called stacks-data-lake-01 (or whatever name you choose)
- Run the migration.sql script in your public schema inside your new database

### 2. Streamer Service

**Local setup**

- Create a .env file in your root folder to hold your environment variables (see `.env.example`):
  - `DATABASE_URL=postgres://DB_USER:DB_USER_PW@DB_HOST/stacks-data-lake-01` (replace DB_USER, DB_USER_PW and DB_HOST placeholders with appropriate values)
  - `NODE_ENV=development`
  - `STACKS_NODE_API_URL=https://stacks-node-api.mainnet.stacks.co/` (this is the main stacks node API, replace the API URL if you are using an alternative)
  - `STACKS_WSS_URL=wss://stacks-node-api.mainnet.stacks.co` (set this to point to the web socket endpoint to listen for new blocks)
  - `STREAM_HISTORICAL_DATA=false` (data will stream immediatley from the tip of the chain, set this value to true if you want to also stream historical data)
- To run the streamer in development mode: `yarn start:dev`
- To run the streamer in prod mode: `yarn start:prod`

**Hosted setup**

- Deploy the repo or code to the hosting environment of your choice
- Set the following environment variables:
  - `DATABASE_URL=postgres://DB_USER:DB_USER_PW@DB_HOST/stacks-data-lake-01` (replace DB_USER, DB_USER_PW and DB_HOST placeholders with appropriate values)
  - `STACKS_NODE_API_URL=https://stacks-node-api.mainnet.stacks.co/` (this is the main stacks node API, replace the API URL if you are using an alternative)
  - `STACKS_WSS_URL=wss://stacks-node-api.mainnet.stacks.co` (set this to point to the web socket endpoint to listen for new blocks)
  - `STREAM_HISTORICAL_DATA=false` (data will stream immediatley from the tip of the chain, set this value to true if you want to also stream historical data)
- Set the build command to `yarn build`
- Set the start command to `yarn start:prod`

**Render auto-deploy**

This option makes it possible to deploy an instance inside a hosted [render.com](https://render.com) service.

To get started, you need to [register for a render account](https://dashboard.render.com/register) and get familiar with the [documentation for render](https://render.com/docs).

Once you've registered, hit this big blue button:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/byzantion-xyz/alexandria-stx-datalake&branch=main)

Important! Please note that this deployment users the free plans for the web service and database (you can upgrade as your needs require). Check the Render pricing for pricing information.
