import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatabaseRoles1679180212820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE ROLE authenticated;`);
    await queryRunner.query(`CREATE ROLE anon;`);

    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;`,
    );

    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;`,
    );

    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM authenticated;`,
    );

    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM authenticated;`,
    );

    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM anon;`,
    );

    await queryRunner.query(`DROP ROLE anon;`);
    await queryRunner.query(`DROP ROLE authenticated;`);
  }
}
