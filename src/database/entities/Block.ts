import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Block {
  @PrimaryColumn()
  hash: string;

  @Column('bigint')
  height: number;

  @Column()
  timestamp: Date;
}
