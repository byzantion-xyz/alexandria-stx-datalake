import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTransactionAddSkipped1667926010513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('alter table transaction add column skipped _text NULL;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('alter table transaction drop column skipped;');
  }
}
