import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1716830307964 implements MigrationInterface {
    name = 'Default1716830307964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "photos" ("id" SERIAL NOT NULL, "publishedDate" TIMESTAMP NOT NULL, "imageUrl" text NOT NULL, "tags" text NOT NULL, CONSTRAINT "PK_5220c45b8e32d49d767b9b3d725" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "photos"`);
    }

}
