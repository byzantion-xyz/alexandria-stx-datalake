import { Column, PrimaryGeneratedColumn, Entity, PrimaryColumn } from 'typeorm';

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
}
