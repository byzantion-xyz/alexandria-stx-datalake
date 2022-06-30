
-- CreateTable
CREATE TABLE "transaction" (
    "hash" TEXT NOT NULL,
    "outcome" JSONB NOT NULL,
    "transaction" JSONB NOT NULL,
    "missing" BOOLEAN NOT NULL DEFAULT false,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "block_hash" TEXT NOT NULL,
    "block_height" BIGINT NOT NULL,
    "block_timestamp" BIGINT NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("hash")
);

CREATE TABLE "block" (
  "hash" TEXT NOT NULL,
  "height" BIGINT NOT NULL,
  "timestamp" BIGINT NOT NULL,
);

/* Add JSONB generated columns */
ALTER TABLE public."transaction" ADD success_receipt_id text NULL GENERATED ALWAYS AS ((((outcome -> 'execution_outcome'::text) -> 'outcome'::text) -> 'status'::text) ->> 'SuccessReceiptId'::text) STORED;
ALTER TABLE public."transaction" ADD receiver_id text NULL GENERATED ALWAYS AS (transaction ->> 'receiver_id'::text) STORED;

/* Create indexes for jsonb generated colums */
CREATE INDEX transaction_receiver_id_idx ON public.transaction USING btree (receiver_id);
CREATE INDEX transaction_success_receipt_id_idx ON public.transaction USING btree (success_receipt_id);
