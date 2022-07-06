
-- CreateTable
CREATE TABLE "transaction" (
    "hash" TEXT NOT NULL,
    "tx" JSONB NOT NULL,
    "missing" BOOLEAN NOT NULL DEFAULT false,
    "processed" BOOLEAN NOT NULL DEFAULT false

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("hash")
);

CREATE TABLE "block" (
  "hash" TEXT NOT NULL,
  "height" BIGINT NOT NULL,
  "timestamp" BIGINT NOT NULL,
  "block" JSONB NOT NULL,

  CONSTRAINT "hash_pkey" PRIMARY KEY ("hash") 
);

/* Add JSONB generated columns */
ALTER TABLE public."transaction" ADD contract_id text NULL GENERATED ALWAYS AS (tx -> 'contract_call'->>'contract_id'::text) STORED;
ALTER TABLE public."transaction" ADD block_height bigint NULL GENERATED ALWAYS AS ((tx -> 'block_height')::bigint) STORED;

/* Create indexes for jsonb generated colums */
CREATE INDEX transaction_contract_id ON public.transaction USING btree (contract_id);
CREATE INDEX transaction_block_height ON public.transaction USING btree (block_height);

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
create trigger notify_blocks after
insert
    on
    public.block for each row execute function notify_block();
