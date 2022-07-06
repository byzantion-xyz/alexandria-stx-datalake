import dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
  databaseUrl: process.env.DATABASE_URL,
  environment: process.env.NODE_ENV
};
