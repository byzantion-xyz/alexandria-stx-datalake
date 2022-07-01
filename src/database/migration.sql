
-- CreateTable
CREATE TABLE "transaction" (
    "hash" TEXT NOT NULL,
    "tx" JSONB NOT NULL,
    "missing" BOOLEAN NOT NULL DEFAULT false,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("hash")
);

CREATE TABLE "block" (
  "hash" TEXT NOT NULL,
  "height" BIGINT NOT NULL,
  "timestamp" BIGINT NOT NULL,

  CONSTRAINT "hash_pkey" PRIMARY KEY ("hash") 
);

/* Add JSONB generated columns */
/*ALTER TABLE public."transaction" ADD success_receipt_id text NULL GENERATED ALWAYS AS ((((outcome -> 'execution_outcome'::text) -> 'outcome'::text) -> 'status'::text) ->> 'SuccessReceiptId'::text) STORED;*/
ALTER TABLE public."transaction" ADD contract_id text NULL GENERATED ALWAYS AS (tx -> 'contract_call'->>'contract_id'::text) STORED;
ALTER TABLE public."transaction" ADD block_height text NULL GENERATED ALWAYS AS (tx ->> 'block_height'::text) STORED;

/* Create indexes for jsonb generated colums */
CREATE INDEX transaction_contract_id ON public.transaction USING btree (contract_id);
CREATE INDEX transaction_block_height ON public.transaction USING btree (block_height);
