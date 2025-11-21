import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCurrencies1763744500000 implements MigrationInterface {
  name = 'SeedCurrencies1763744500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert base currencies (EUR is base, so rateFromBase = 1)
    await queryRunner.query(`
      INSERT INTO "currency" ("code", "name", "symbol", "rateFromBase")
      VALUES
        ('EUR', 'Euro', '€', 1),
        ('USD', 'US Dollar', '$', 1.08)
      ON CONFLICT ("code") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "currency" WHERE "code" IN ('EUR', 'USD')
    `);
  }
}
