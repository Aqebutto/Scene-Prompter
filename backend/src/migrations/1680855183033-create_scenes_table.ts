import { MigrationInterface, QueryRunner } from 'typeorm';

export class createScenesTable1617610101144 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE scenes (
        id SERIAL PRIMARY KEY,
        time VARCHAR(255),
        name VARCHAR(255),
        prompt VARCHAR(255),
        img VARCHAR(255)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE scenes`);
  }
}
