import { MigrationInterface, QueryRunner } from 'typeorm';

export class fail1667486457950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`fail;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`select 1;`);
  }
}
