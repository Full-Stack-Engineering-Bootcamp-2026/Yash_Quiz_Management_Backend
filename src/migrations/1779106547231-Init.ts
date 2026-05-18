import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779106547231 implements MigrationInterface {
    name = 'Init1779106547231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question_groups\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question_groups\` DROP COLUMN \`createdAt\``);
    }

}
