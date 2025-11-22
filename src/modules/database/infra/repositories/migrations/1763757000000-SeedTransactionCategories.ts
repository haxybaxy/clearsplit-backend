import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTransactionCategories1763757000000
  implements MigrationInterface
{
  name = 'SeedTransactionCategories1763757000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Seed stock transaction categories (custom = false, teamId = null)
    await queryRunner.query(`
      INSERT INTO "transaction_category" ("id", "name", "custom", "createdAt", "updatedAt")
      VALUES
        (gen_random_uuid(), 'Rent', false, now(), now()),
        (gen_random_uuid(), 'Cleaning', false, now(), now()),
        (gen_random_uuid(), 'Platform Fee', false, now(), now()),
        (gen_random_uuid(), 'Tax', false, now(), now()),
        (gen_random_uuid(), 'Maintenance', false, now(), now())
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "transaction_category"
      WHERE "name" IN ('rent', 'cleaning', 'platform_fee', 'tax', 'maintenance')
        AND "custom" = false
    `);
  }
}
