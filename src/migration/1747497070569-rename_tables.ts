import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTables1747497070569 implements MigrationInterface {
    name = 'RenameTables1747497070569';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`,
        );

        await queryRunner.renameTable('user', 'Users');
        await queryRunner.renameTable('refresh_token', 'RefreshTokens');

        await queryRunner.query(
            `ALTER TABLE "RefreshTokens" ADD CONSTRAINT "FK_6dfd786f75cfe054e9ae3a45f5e" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "RefreshTokens" DROP CONSTRAINT "FK_6dfd786f75cfe054e9ae3a45f5e"`,
        );

        await queryRunner.renameTable('Users', 'user');
        await queryRunner.renameTable('RefreshTokens', 'refresh_token');
    }
}
