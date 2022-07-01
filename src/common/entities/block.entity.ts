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

@Entity()
export class Block {
  @PrimaryKey({ type: 'string' })
  hash!: string;

  @Property({ type: 'bigint' })
  height!: bigint;

  @Property({ type: 'bigint' })
  timestamp!: bigint;
}
