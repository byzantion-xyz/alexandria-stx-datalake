# Alexandria Stacks Data Lake

## Overview

The Alexandria Stacks TX Data Lake consists of 2 key components:

1. A PostgreSQL database that stores Stacks chain transaction data
2. A streamer service that connects to a designated Stacks API Node and streams transactions into the database

## Setup

To setup the Data Lake and Streamer Service, follow these steps:

### 1. Database

- Ensure that you have a PostgreSQL database instance up and running
- Create a database on your instance called stacks-data-lake-01 (or whatever name you want)
- Run the migration.sql script in your public schema inside your new database

### 2. Streamer Service

**Local setup**

- Create a .env file in your root folder to hold your environment variables (see `.env.example`):
  - `DATABASE_URL=postgres://DB_USER:DB_USER_PW@DB_HOST/stacks-data-lake-01` (replace DB_USER, DB_USER_PW and DB_HOST placeholders with appropriate values)
  - `NODE_ENV=development`
  - `STACKS_NODE_API_URL=https://stacks-node-api.mainnet.stacks.co/` (this is the main stacks node API, replace the API URL if you are using an alternative)
- To run the streamer in development mode: `yarn start:dev`
- To run the streamer in prod mode: `yarn start:prod`

**Hosted setup**

- Deploy the repo or code to the hosting environment of your choice
- Set the following environment variables:
  - `DATABASE_URL=postgres://DB_USER:DB_USER_PW@DB_HOST/stacks-data-lake-01` (replace DB_USER, DB_USER_PW and DB_HOST placeholders with appropriate values)
  - `STACKS_NODE_API_URL=https://stacks-node-api.mainnet.stacks.co/` (this is the main stacks node API, replace the API URL if you are using an alternative)
- Set the build command to `yarn build`
- Set the start command to `yarn start:prod`
