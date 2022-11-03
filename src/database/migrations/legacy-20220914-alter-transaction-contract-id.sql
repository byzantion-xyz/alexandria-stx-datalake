-- removes the stored column property so that we can set this value in code
alter table transaction
alter column contract_id drop expression;