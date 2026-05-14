import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778762116059 implements MigrationInterface {
    name = 'Init1778762116059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`question_options\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(36) NOT NULL, \`text\` varchar(255) NOT NULL, \`questionId\` int NOT NULL, UNIQUE INDEX \`IDX_cb7079099cb7f28d9ba9dd2bdd\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(36) NOT NULL, \`text\` varchar(255) NOT NULL, \`type\` enum ('radio', 'checkbox', 'textarea') NOT NULL, \`version\` int NOT NULL DEFAULT '1', \`isLatest\` tinyint NOT NULL DEFAULT 1, \`groupId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_f1076ad7470deef426c9953e2f\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question_groups\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(36) NOT NULL, UNIQUE INDEX \`IDX_68d45ec94152e4bd7e878305c0\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quizzes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_8ffd97b11bb2cfd09bd6dcc260\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`attempt_answers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(36) NOT NULL, \`attemptId\` int NOT NULL, \`questionId\` int NOT NULL, \`textResponse\` text NULL, UNIQUE INDEX \`IDX_89dfc38252a2eb5e7fc7aef431\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`attempts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(36) NOT NULL, \`userId\` int NOT NULL, \`quizId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6943fa84b4dd6c9e4d8fb438b6\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6e20ce1edf0678a09f1963f958\` (\`uid\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quiz_questions\` (\`quizId\` int NOT NULL, \`questionGroupId\` int NOT NULL, INDEX \`IDX_8889ccc5a40989ea308a588870\` (\`quizId\`), INDEX \`IDX_09a560b7786f9a6aa5d8584d2d\` (\`questionGroupId\`), PRIMARY KEY (\`quizId\`, \`questionGroupId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`attempt_answer_options\` (\`attemptAnswerId\` int NOT NULL, \`questionOptionId\` int NOT NULL, INDEX \`IDX_9e20baebec9eb95e0e2c967bc2\` (\`attemptAnswerId\`), INDEX \`IDX_8a40691bc6ea890506e15103fc\` (\`questionOptionId\`), PRIMARY KEY (\`attemptAnswerId\`, \`questionOptionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`question_options\` ADD CONSTRAINT \`FK_c654af7759a681f1b1addbe35bf\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_09feeade34acdfb5d972a9fa9d6\` FOREIGN KEY (\`groupId\`) REFERENCES \`question_groups\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attempt_answers\` ADD CONSTRAINT \`FK_76e6a7dc4c1894250800077e79b\` FOREIGN KEY (\`attemptId\`) REFERENCES \`attempts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attempt_answers\` ADD CONSTRAINT \`FK_382ef7a450def2331b236e49268\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attempts\` ADD CONSTRAINT \`FK_a6abb83b4ea66267571e4315a9c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attempts\` ADD CONSTRAINT \`FK_f1246426f57a518bb0e93b50656\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_questions\` ADD CONSTRAINT \`FK_8889ccc5a40989ea308a588870e\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`quiz_questions\` ADD CONSTRAINT \`FK_09a560b7786f9a6aa5d8584d2db\` FOREIGN KEY (\`questionGroupId\`) REFERENCES \`question_groups\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`attempt_answer_options\` ADD CONSTRAINT \`FK_9e20baebec9eb95e0e2c967bc28\` FOREIGN KEY (\`attemptAnswerId\`) REFERENCES \`attempt_answers\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`attempt_answer_options\` ADD CONSTRAINT \`FK_8a40691bc6ea890506e15103fc9\` FOREIGN KEY (\`questionOptionId\`) REFERENCES \`question_options\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`attempt_answer_options\` DROP FOREIGN KEY \`FK_8a40691bc6ea890506e15103fc9\``);
        await queryRunner.query(`ALTER TABLE \`attempt_answer_options\` DROP FOREIGN KEY \`FK_9e20baebec9eb95e0e2c967bc28\``);
        await queryRunner.query(`ALTER TABLE \`quiz_questions\` DROP FOREIGN KEY \`FK_09a560b7786f9a6aa5d8584d2db\``);
        await queryRunner.query(`ALTER TABLE \`quiz_questions\` DROP FOREIGN KEY \`FK_8889ccc5a40989ea308a588870e\``);
        await queryRunner.query(`ALTER TABLE \`attempts\` DROP FOREIGN KEY \`FK_f1246426f57a518bb0e93b50656\``);
        await queryRunner.query(`ALTER TABLE \`attempts\` DROP FOREIGN KEY \`FK_a6abb83b4ea66267571e4315a9c\``);
        await queryRunner.query(`ALTER TABLE \`attempt_answers\` DROP FOREIGN KEY \`FK_382ef7a450def2331b236e49268\``);
        await queryRunner.query(`ALTER TABLE \`attempt_answers\` DROP FOREIGN KEY \`FK_76e6a7dc4c1894250800077e79b\``);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_09feeade34acdfb5d972a9fa9d6\``);
        await queryRunner.query(`ALTER TABLE \`question_options\` DROP FOREIGN KEY \`FK_c654af7759a681f1b1addbe35bf\``);
        await queryRunner.query(`DROP INDEX \`IDX_8a40691bc6ea890506e15103fc\` ON \`attempt_answer_options\``);
        await queryRunner.query(`DROP INDEX \`IDX_9e20baebec9eb95e0e2c967bc2\` ON \`attempt_answer_options\``);
        await queryRunner.query(`DROP TABLE \`attempt_answer_options\``);
        await queryRunner.query(`DROP INDEX \`IDX_09a560b7786f9a6aa5d8584d2d\` ON \`quiz_questions\``);
        await queryRunner.query(`DROP INDEX \`IDX_8889ccc5a40989ea308a588870\` ON \`quiz_questions\``);
        await queryRunner.query(`DROP TABLE \`quiz_questions\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_6e20ce1edf0678a09f1963f958\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_6943fa84b4dd6c9e4d8fb438b6\` ON \`attempts\``);
        await queryRunner.query(`DROP TABLE \`attempts\``);
        await queryRunner.query(`DROP INDEX \`IDX_89dfc38252a2eb5e7fc7aef431\` ON \`attempt_answers\``);
        await queryRunner.query(`DROP TABLE \`attempt_answers\``);
        await queryRunner.query(`DROP INDEX \`IDX_8ffd97b11bb2cfd09bd6dcc260\` ON \`quizzes\``);
        await queryRunner.query(`DROP TABLE \`quizzes\``);
        await queryRunner.query(`DROP INDEX \`IDX_68d45ec94152e4bd7e878305c0\` ON \`question_groups\``);
        await queryRunner.query(`DROP TABLE \`question_groups\``);
        await queryRunner.query(`DROP INDEX \`IDX_f1076ad7470deef426c9953e2f\` ON \`questions\``);
        await queryRunner.query(`DROP TABLE \`questions\``);
        await queryRunner.query(`DROP INDEX \`IDX_cb7079099cb7f28d9ba9dd2bdd\` ON \`question_options\``);
        await queryRunner.query(`DROP TABLE \`question_options\``);
    }

}
