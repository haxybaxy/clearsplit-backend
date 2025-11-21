import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransactionCategory1763756979408 implements MigrationInterface {
    name = 'AddTransactionCategory1763756979408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_transaction_component_finalCurrencyId_currency"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_transaction_component_originalCurrencyId_currency"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_6f027e4157ed480636a115228ea"`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP CONSTRAINT "FK_allocation_currencyId_currency"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_transaction_finalCurrencyId_currency"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_transaction_originalCurrencyId_currency"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_team_defaultCurrencyId_currency"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" RENAME COLUMN "category" TO "categoryId"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_component_category_enum" RENAME TO "transaction_component_categoryid_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_category_category_enum" AS ENUM('stock', 'custom')`);
        await queryRunner.query(`CREATE TABLE "transaction_category" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying, "category" "public"."transaction_category_category_enum" NOT NULL DEFAULT 'custom', CONSTRAINT "PK_abbe63b71ee4193f61c322ab497" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "categoryId" uuid`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('income', 'expense')`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "type" "public"."transaction_type_enum" NOT NULL DEFAULT 'income'`);
        await queryRunner.query(`ALTER TABLE "transaction_component" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "transaction_component" DROP COLUMN "finalCurrencyId"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" ADD "finalCurrencyId" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction_component" DROP COLUMN "originalCurrencyId"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" ADD "originalCurrencyId" character varying`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP COLUMN "currencyId"`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD "currencyId" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "finalCurrencyId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "finalCurrencyId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "originalCurrencyId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "originalCurrencyId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "defaultCurrencyId"`);
        await queryRunner.query(`ALTER TABLE "team" ADD "defaultCurrencyId" character varying NOT NULL DEFAULT 'EUR'`);
        await queryRunner.query(`ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_1a222a440eaf5c03d63f3bef141" FOREIGN KEY ("categoryId") REFERENCES "transaction_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_af9d692874083ed6dd1173e1c4e" FOREIGN KEY ("finalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_20f7a7f2a94e0b61518daee26d0" FOREIGN KEY ("originalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD CONSTRAINT "FK_10de016337a8f8c8338c530ca45" FOREIGN KEY ("currencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_d3951864751c5812e70d033978d" FOREIGN KEY ("categoryId") REFERENCES "transaction_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_05fadae0a2c0562efe5200d6bf2" FOREIGN KEY ("finalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_0011d8e7136d9d30f5df212bcc4" FOREIGN KEY ("originalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_9fbedfd654dae0d57a7dde313df" FOREIGN KEY ("defaultCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_9fbedfd654dae0d57a7dde313df"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_0011d8e7136d9d30f5df212bcc4"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_05fadae0a2c0562efe5200d6bf2"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_d3951864751c5812e70d033978d"`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP CONSTRAINT "FK_10de016337a8f8c8338c530ca45"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_20f7a7f2a94e0b61518daee26d0"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_af9d692874083ed6dd1173e1c4e"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_1a222a440eaf5c03d63f3bef141"`);
        await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "defaultCurrencyId"`);
        await queryRunner.query(`ALTER TABLE "team" ADD "defaultCurrencyId" character varying(3) NOT NULL DEFAULT 'EUR'`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "originalCurrencyId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "originalCurrencyId" character varying(3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "finalCurrencyId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "finalCurrencyId" character varying(3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP COLUMN "currencyId"`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD "currencyId" character varying(3)`);
        await queryRunner.query(`ALTER TABLE "transaction_component" DROP COLUMN "originalCurrencyId"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" ADD "originalCurrencyId" character varying(3)`);
        await queryRunner.query(`ALTER TABLE "transaction_component" DROP COLUMN "finalCurrencyId"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" ADD "finalCurrencyId" character varying(3)`);
        await queryRunner.query(`ALTER TABLE "transaction_component" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" ADD "categoryId" "public"."transaction_component_categoryid_enum" NOT NULL DEFAULT 'rent'`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "category" character varying`);
        await queryRunner.query(`DROP TABLE "transaction_category"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_category_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_component_categoryid_enum" RENAME TO "transaction_component_category_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction_component" RENAME COLUMN "categoryId" TO "category"`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_team_defaultCurrencyId_currency" FOREIGN KEY ("defaultCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_transaction_originalCurrencyId_currency" FOREIGN KEY ("originalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_transaction_finalCurrencyId_currency" FOREIGN KEY ("finalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD CONSTRAINT "FK_allocation_currencyId_currency" FOREIGN KEY ("currencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_6f027e4157ed480636a115228ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_transaction_component_originalCurrencyId_currency" FOREIGN KEY ("originalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_transaction_component_finalCurrencyId_currency" FOREIGN KEY ("finalCurrencyId") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
