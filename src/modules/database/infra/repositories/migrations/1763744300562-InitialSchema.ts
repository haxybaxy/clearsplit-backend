import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1763744300562 implements MigrationInterface {
  name = 'InitialSchema1763744300562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_component_category_enum" AS ENUM('rent', 'cleaning', 'platform_fee', 'tax', 'maintenance')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_component" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "category" "public"."transaction_component_category_enum" NOT NULL DEFAULT 'rent', "finalAmount" integer NOT NULL, "originalAmount" integer NOT NULL, "transactionId" uuid NOT NULL, "finalCurrencyId" uuid, "originalCurrencyId" uuid, CONSTRAINT "PK_48557f590d65ca44621a73a4e80" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contact" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying, "phone" character varying, "notes" character varying, "teamId" uuid NOT NULL, "userId" uuid, CONSTRAINT "REL_6f027e4157ed480636a115228e" UNIQUE ("userId"), CONSTRAINT "PK_ad6d4f7655e718140c452dabc0b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stakeholder" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "contactId" uuid NOT NULL, "propertyId" uuid NOT NULL, CONSTRAINT "PK_789fe9f27e810783e0adbc0bf71" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "split_plan" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "isActive" boolean NOT NULL, "expirationDate" TIMESTAMP, "propertyId" uuid NOT NULL, CONSTRAINT "PK_e22148dbd07169ec26325944f16" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "split_rule" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "order" integer NOT NULL, "base" jsonb NOT NULL, "splitPlanId" uuid NOT NULL, CONSTRAINT "PK_5a06e5ab76dfad9a7d755231661" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."allocation_type_enum" AS ENUM('percent', 'fixed', 'method')`,
    );
    await queryRunner.query(
      `CREATE TABLE "allocation" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "splitRuleId" character varying NOT NULL, "stakeholderId" uuid NOT NULL, "type" "public"."allocation_type_enum" NOT NULL DEFAULT 'percent', "value" jsonb NOT NULL, "currencyId" uuid, "splitRule" uuid, CONSTRAINT "PK_7df89c736595e454b6ae07264fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "currency" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "symbol" character varying NOT NULL, "rateFromBase" integer NOT NULL, CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "description" character varying, "category" character varying, "finalAmount" integer NOT NULL, "originalAmount" integer NOT NULL, "finalCurrencyId" uuid NOT NULL, "originalCurrencyId" uuid NOT NULL, "exchangeRate" integer NOT NULL DEFAULT '0', "propertyId" uuid NOT NULL, "contactId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "property" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "alias" character varying NOT NULL, "address" character varying NOT NULL, "teamId" uuid NOT NULL, CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "ownerId" uuid NOT NULL, "defaultCurrencyId" uuid NOT NULL, CONSTRAINT "REL_49a22109d0b97611c07768e37f" UNIQUE ("ownerId"), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."team_member_role_enum" AS ENUM('owner', 'member')`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_member" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "teamId" uuid NOT NULL, "userId" uuid NOT NULL, "role" "public"."team_member_role_enum" NOT NULL DEFAULT 'member', CONSTRAINT "PK_649680684d72a20d279641469c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "avatarUrl" character varying, "supabaseId" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_dc3242bf714f738cf0d659c69e9" UNIQUE ("supabaseId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_29fdd1c09a11ae38803509b1843" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_af9d692874083ed6dd1173e1c4e" FOREIGN KEY ("finalCurrencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" ADD CONSTRAINT "FK_20f7a7f2a94e0b61518daee26d0" FOREIGN KEY ("originalCurrencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact" ADD CONSTRAINT "FK_6f027e4157ed480636a115228ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact" ADD CONSTRAINT "FK_contact_teamId" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stakeholder" ADD CONSTRAINT "FK_2a7a7fe9f7747337819170d82bd" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stakeholder" ADD CONSTRAINT "FK_de5b46fc8f50b8b62009f8eae23" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "split_plan" ADD CONSTRAINT "FK_5d5f04d281e653b2b4224b2e10a" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "split_rule" ADD CONSTRAINT "FK_f4f258bf9af278409ec226b087f" FOREIGN KEY ("splitPlanId") REFERENCES "split_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" ADD CONSTRAINT "FK_3faadfa5171e11acbe147b04f7e" FOREIGN KEY ("splitRule") REFERENCES "split_rule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" ADD CONSTRAINT "FK_3438994a73bdacc504384f83f83" FOREIGN KEY ("stakeholderId") REFERENCES "stakeholder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" ADD CONSTRAINT "FK_10de016337a8f8c8338c530ca45" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_05fadae0a2c0562efe5200d6bf2" FOREIGN KEY ("finalCurrencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_0011d8e7136d9d30f5df212bcc4" FOREIGN KEY ("originalCurrencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_e58c3b8c65d0ed30f1ac77260bf" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_15947812d7f1cea4db5a8df19af" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "property" ADD CONSTRAINT "FK_e6423a8fff5223de52f0c53eee9" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_49a22109d0b97611c07768e37f1" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_9fbedfd654dae0d57a7dde313df" FOREIGN KEY ("defaultCurrencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "FK_74da8f612921485e1005dc8e225" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "FK_d2be3e8fc9ab0f69673721c7fc3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "FK_d2be3e8fc9ab0f69673721c7fc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "FK_74da8f612921485e1005dc8e225"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_9fbedfd654dae0d57a7dde313df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_49a22109d0b97611c07768e37f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property" DROP CONSTRAINT "FK_e6423a8fff5223de52f0c53eee9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_15947812d7f1cea4db5a8df19af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_e58c3b8c65d0ed30f1ac77260bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_0011d8e7136d9d30f5df212bcc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_05fadae0a2c0562efe5200d6bf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" DROP CONSTRAINT "FK_10de016337a8f8c8338c530ca45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" DROP CONSTRAINT "FK_3438994a73bdacc504384f83f83"`,
    );
    await queryRunner.query(
      `ALTER TABLE "allocation" DROP CONSTRAINT "FK_3faadfa5171e11acbe147b04f7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "split_rule" DROP CONSTRAINT "FK_f4f258bf9af278409ec226b087f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "split_plan" DROP CONSTRAINT "FK_5d5f04d281e653b2b4224b2e10a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stakeholder" DROP CONSTRAINT "FK_de5b46fc8f50b8b62009f8eae23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stakeholder" DROP CONSTRAINT "FK_2a7a7fe9f7747337819170d82bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact" DROP CONSTRAINT "FK_contact_teamId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact" DROP CONSTRAINT "FK_6f027e4157ed480636a115228ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_20f7a7f2a94e0b61518daee26d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_af9d692874083ed6dd1173e1c4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_component" DROP CONSTRAINT "FK_29fdd1c09a11ae38803509b1843"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "team_member"`);
    await queryRunner.query(`DROP TYPE "public"."team_member_role_enum"`);
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP TABLE "property"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "currency"`);
    await queryRunner.query(`DROP TABLE "allocation"`);
    await queryRunner.query(`DROP TYPE "public"."allocation_type_enum"`);
    await queryRunner.query(`DROP TABLE "split_rule"`);
    await queryRunner.query(`DROP TABLE "split_plan"`);
    await queryRunner.query(`DROP TABLE "stakeholder"`);
    await queryRunner.query(`DROP TABLE "contact"`);
    await queryRunner.query(`DROP TABLE "transaction_component"`);
    await queryRunner.query(
      `DROP TYPE "public"."transaction_component_category_enum"`,
    );
  }
}
