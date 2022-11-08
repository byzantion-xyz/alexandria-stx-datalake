import { MigrationInterface, QueryRunner } from 'typeorm';

export class firstMigration1667469842611 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- CreateTable
            CREATE TABLE IF NOT EXISTS public."transaction" (
                hash varchar NOT NULL,
                tx jsonb NOT NULL,
                processed bool NOT NULL DEFAULT false,
                missing bool NOT NULL DEFAULT false,
                /* JSONB generated columns */
                contract_id text NULL GENERATED ALWAYS AS ((tx -> 'contract_call'::text) ->> 'contract_id'::text) STORED,
                block_height int8 NULL GENERATED ALWAYS AS ((tx -> 'block_height'::text)::bigint) STORED,                

                CONSTRAINT "transaction_pkey" PRIMARY KEY (hash)
            );

            ALTER TABLE transaction ALTER COLUMN contract_id DROP EXPRESSION;

            CREATE TABLE IF NOT EXISTS public.block (
                hash varchar NOT NULL,
                height int8 NOT NULL,
                "timestamp" timestamp NOT NULL,
                block jsonb NOT NULL,

                CONSTRAINT "block_hash_pkey" PRIMARY KEY (hash),
                CONSTRAINT "block_height_ukey" UNIQUE (height)
            );


            /* Create indexes for jsonb generated colums */
            CREATE INDEX IF NOT EXISTS transaction_block_height ON public.transaction USING btree (block_height);
            CREATE INDEX IF NOT EXISTS transaction_contract_id ON public.transaction USING btree (contract_id);

            /* Create function to notify upon block saved */
            CREATE OR REPLACE FUNCTION public.notify_block()
            RETURNS trigger
            LANGUAGE plpgsql
            AS $function$
            declare 
                begin 
                    perform pg_notify( cast('new_block' as text), new.height::TEXT);
                    return null;
                end
            $function$
            ;

            /* Add trigger to notify events */
            CREATE OR REPLACE trigger notify_blocks after
            insert
                on
                public.block for each row execute function notify_block();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS public."transaction";
        DROP TABLE IF EXISTS public.block;
        DROP FUNCTION IF EXISTS public.notify_block();
    `);
  }
}
