import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn()
  hash: string;

  @Column('jsonb')
  tx: JSON;

  @Column({ default: false })
  processed: boolean;

  @Column({ default: false })
  missing: boolean;

  @Column()
  readonly contract_id!: string;

  @Column()
  readonly block_height!: number;
}
