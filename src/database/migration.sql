
-- CreateTable
CREATE TABLE "transaction" (
    "hash" TEXT NOT NULL,
    "tx" JSONB NOT NULL,
    "missing" BOOLEAN NOT NULL DEFAULT false,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "contract_id" TEXT NOT NULL,
    "block_height" BIGINT NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("hash")
);

CREATE TABLE "block" (
  "hash" TEXT NOT NULL,
  "height" BIGINT NOT NULL,
  "timestamp" BIGINT NOT NULL,

  CONSTRAINT "hash_pkey" PRIMARY KEY ("hash") 
);


/* Create indexes for jsonb generated colums */
CREATE INDEX transaction_contract_id ON public.transaction USING btree (contract_id);
CREATE INDEX transaction_block_height ON public.transaction USING btree (block_height);
