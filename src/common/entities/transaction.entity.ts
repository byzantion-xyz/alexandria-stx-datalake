import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
  ManyToOne,
  PrimaryKey,
  SerializedPrimaryKey
} from '@mikro-orm/core';

import type { Transaction as StacksTransaction } from '@stacks/stacks-blockchain-api-types';

@Entity()
export class Transaction {
  @PrimaryKey({ type: 'string' })
  hash!: string;

  @Property({ type: 'JSON' })
  tx: JSON;

  @Property({ type: 'boolean', default: false })
  missing = false;

  @Property({ type: 'boolean', default: false })
  processed = false;

  constructor(hash: string, tx: JSON) {
    this.hash = hash;
    this.tx = tx;
  }
}
