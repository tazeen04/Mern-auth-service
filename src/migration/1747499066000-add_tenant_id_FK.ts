import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantIdFK1747499066000 implements MigrationInterface {
    name = 'AddTenantIdFK1747499066000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "tenantId" integer`);
        await queryRunner.query(
            `ALTER TABLE "Users" ADD CONSTRAINT "FK_b7b98598ea1d5cd4e0bfd017bf6" FOREIGN KEY ("tenantId") REFERENCES "Tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "Users" DROP CONSTRAINT "FK_b7b98598ea1d5cd4e0bfd017bf6"`,
        );
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "tenantId"`);
    }
}
