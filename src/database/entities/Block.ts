import { Column, Entity, PrimaryColumn, Timestamp } from 'typeorm';

@Entity()
export class Block {
  @PrimaryColumn()
  hash: string;

  @Column('bigint')
  height: bigint;

  @Column()
  timestamp: Date;
}
