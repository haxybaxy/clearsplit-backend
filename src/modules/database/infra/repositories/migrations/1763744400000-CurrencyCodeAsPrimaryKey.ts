import { MigrationInterface, QueryRunner } from 'typeorm';

export class CurrencyCodeAsPrimaryKey1763744400000
  implements MigrationInterface
{
  name = 'CurrencyCodeAsPrimaryKey1763744400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Drop all foreign key constraints referencing currency.id
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_9fbedfd654dae0d57a7dde313df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_05fadae0a2c0562efe5200d6bf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_0011d8e7136d9d30f5df212bcc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_af9d692874083ed6dd1173e1c4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_20f7a7f2a94e0b61518daee26d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" DROP CONSTRAINT "FK_10de016337a8f8c8338c530ca45"`,
    );

    // Step 2: Add temporary columns to store currency codes
    await queryRunner.query(
      `ALTER TABLE "team" ADD "defaultCurrencyCode" character varying(3)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "finalCurrencyCode" character varying(3)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "originalCurrencyCode" character varying(3)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" ADD "finalCurrencyCode" character varying(3)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" ADD "originalCurrencyCode" character varying(3)`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" ADD "currencyCode" character varying(3)`,
    );

    // Step 3: Copy data from uuid columns to code columns via lookup
    await queryRunner.query(`
      UPDATE "team" t
      SET "defaultCurrencyCode" = c.code
      FROM "currency" c
      WHERE t."defaultCurrencyId" = c.id
    `);
    await queryRunner.query(`
      UPDATE "transaction" t
      SET "finalCurrencyCode" = c.code
      FROM "currency" c
      WHERE t."finalCurrencyId" = c.id
    `);
    await queryRunner.query(`
      UPDATE "transaction" t
      SET "originalCurrencyCode" = c.code
      FROM "currency" c
      WHERE t."originalCurrencyId" = c.id
    `);
    await queryRunner.query(`
      UPDATE "transaction_component" tc
      SET "finalCurrencyCode" = c.code
      FROM "currency" c
      WHERE tc."finalCurrencyId" = c.id
    `);
    await queryRunner.query(`
      UPDATE "transaction_component" tc
      SET "originalCurrencyCode" = c.code
      FROM "currency" c
      WHERE tc."originalCurrencyId" = c.id
    `);
    await queryRunner.query(`
      UPDATE "allocation" a
      SET "currencyCode" = c.code
      FROM "currency" c
      WHERE a."currencyId" = c.id
    `);

    // Step 4: Drop old uuid columns
    await queryRunner.query(
      `ALTER TABLE "team" DROP COLUMN "defaultCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "finalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "originalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" DROP COLUMN "finalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" DROP COLUMN "originalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" DROP COLUMN "currencyId"`,
    );

    // Step 5: Rename code columns to original names
    await queryRunner.query(
      `ALTER TABLE "team" RENAME COLUMN "defaultCurrencyCode" TO "defaultCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME COLUMN "finalCurrencyCode" TO "finalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME COLUMN "originalCurrencyCode" TO "originalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" RENAME COLUMN "finalCurrencyCode" TO "finalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" RENAME COLUMN "originalCurrencyCode" TO "originalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" RENAME COLUMN "currencyCode" TO "currencyId"`,
    );

    // Step 6: Set default value for team.defaultCurrencyId
    await queryRunner.query(
      `ALTER TABLE "team" ALTER COLUMN "defaultCurrencyId" SET DEFAULT 'EUR'`,
    );

    // Step 7: Set NOT NULL constraints where required
    await queryRunner.query(
      `ALTER TABLE "team" ALTER COLUMN "defaultCurrencyId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "finalCurrencyId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "originalCurrencyId" SET NOT NULL`,
    );

    // Step 7.5: Alter code column to varchar(3) for ISO 4217 compliance
    await queryRunner.query(
      `ALTER TABLE "currency" ALTER COLUMN "code" TYPE character varying(3)`,
    );

    // Step 8: Change currency primary key from id (uuid) to code (varchar)
    await queryRunner.query(
      `ALTER TABLE "currency" DROP CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91"`,
    );
    await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "currency" ADD CONSTRAINT "PK_currency_code" PRIMARY KEY ("code")`,
    );

    // Step 9: Recreate foreign key constraints referencing currency.code
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_team_defaultCurrencyId_currency" FOREIGN KEY ("defaultCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_transaction_finalCurrencyId_currency" FOREIGN KEY ("finalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_transaction_originalCurrencyId_currency" FOREIGN KEY ("originalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_transaction_component_finalCurrencyId_currency" FOREIGN KEY ("finalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_transaction_component_originalCurrencyId_currency" FOREIGN KEY ("originalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" ADD CONSTRAINT "FK_allocation_currencyId_currency" FOREIGN KEY ("currencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Step 10: Drop supabaseId column from user table (id is now the Supabase ID)
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "UQ_dc3242bf714f738cf0d659c69e9"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "supabaseId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 0: Restore supabaseId column
    await queryRunner.query(
      `ALTER TABLE "user" ADD "supabaseId" character varying`,
    );
    await queryRunner.query(`UPDATE "user" SET "supabaseId" = "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_dc3242bf714f738cf0d659c69e9" UNIQUE ("supabaseId")`,
    );

    // Step 1: Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "allocation" DROP CONSTRAINT "FK_allocation_currencyId_currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_transaction_component_originalCurrencyId_currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_transaction_component_finalCurrencyId_currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_transaction_originalCurrencyId_currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_transaction_finalCurrencyId_currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_team_defaultCurrencyId_currency"`,
    );

    // Step 2: Revert currency primary key to uuid
    await queryRunner.query(
      `ALTER TABLE "currency" DROP CONSTRAINT "PK_currency_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "currency" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "currency" ADD CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id")`,
    );

    // Step 3: Remove default value from team.defaultCurrencyId
    await queryRunner.query(
      `ALTER TABLE "team" ALTER COLUMN "defaultCurrencyId" DROP DEFAULT`,
    );

    // Step 4: Add temporary uuid columns
    await queryRunner.query(
      `ALTER TABLE "team" ADD "defaultCurrencyUuid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "finalCurrencyUuid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "originalCurrencyUuid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" ADD "finalCurrencyUuid" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" ADD "originalCurrencyUuid" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "allocation" ADD "currencyUuid" uuid`);

    // Step 5: Copy data from code columns to uuid columns via lookup
    await queryRunner.query(`
      UPDATE "team" t
      SET "defaultCurrencyUuid" = c.id
      FROM "currency" c
      WHERE t."defaultCurrencyId" = c.code
    `);
    await queryRunner.query(`
      UPDATE "transaction" tr
      SET "finalCurrencyUuid" = c.id
      FROM "currency" c
      WHERE tr."finalCurrencyId" = c.code
    `);
    await queryRunner.query(`
      UPDATE "transaction" tr
      SET "originalCurrencyUuid" = c.id
      FROM "currency" c
      WHERE tr."originalCurrencyId" = c.code
    `);
    await queryRunner.query(`
      UPDATE "transaction_component" tc
      SET "finalCurrencyUuid" = c.id
      FROM "currency" c
      WHERE tc."finalCurrencyId" = c.code
    `);
    await queryRunner.query(`
      UPDATE "transaction_component" tc
      SET "originalCurrencyUuid" = c.id
      FROM "currency" c
      WHERE tc."originalCurrencyId" = c.code
    `);
    await queryRunner.query(`
      UPDATE "allocation" a
      SET "currencyUuid" = c.id
      FROM "currency" c
      WHERE a."currencyId" = c.code
    `);

    // Step 6: Drop varchar columns
    await queryRunner.query(
      `ALTER TABLE "team" DROP COLUMN "defaultCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "finalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "originalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" DROP COLUMN "finalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" DROP COLUMN "originalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" DROP COLUMN "currencyId"`,
    );

    // Step 7: Rename uuid columns to original names
    await queryRunner.query(
      `ALTER TABLE "team" RENAME COLUMN "defaultCurrencyUuid" TO "defaultCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME COLUMN "finalCurrencyUuid" TO "finalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME COLUMN "originalCurrencyUuid" TO "originalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" RENAME COLUMN "finalCurrencyUuid" TO "finalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" RENAME COLUMN "originalCurrencyUuid" TO "originalCurrencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" RENAME COLUMN "currencyUuid" TO "currencyId"`,
    );

    // Step 8: Set NOT NULL constraints
    await queryRunner.query(
      `ALTER TABLE "team" ALTER COLUMN "defaultCurrencyId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "finalCurrencyId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "originalCurrencyId" SET NOT NULL`,
    );

    // Step 9: Recreate original foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_9fbedfd654dae0d57a7dde313df" FOREIGN KEY ("defaultCurrencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_05fadae0a2c0562efe5200d6bf2" FOREIGN KEY ("finalCurrencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_0011d8e7136d9d30f5df212bcc4" FOREIGN KEY ("originalCurrencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_af9d692874083ed6dd1173e1c4e" FOREIGN KEY ("finalCurrencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_20f7a7f2a94e0b61518daee26d0" FOREIGN KEY ("originalCurrencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" ADD CONSTRAINT "FK_10de016337a8f8c8338c530ca45" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
