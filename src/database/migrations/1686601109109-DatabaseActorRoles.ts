import { MigrationInterface, QueryRunner } from 'typeorm';
import { DatabaseActorRole } from '../constants/DatabaseActorRole';

export class DatabaseActorRoles1686601109109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE ROLE ${DatabaseActorRole.ANON};`);
    await queryRunner.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DatabaseActorRole.ANON};`);

    await queryRunner.query(`CREATE ROLE ${DatabaseActorRole.USER};`);
    await queryRunner.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DatabaseActorRole.USER};`);
    await queryRunner.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DatabaseActorRole.USER};`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM ${DatabaseActorRole.USER};`);
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM ${DatabaseActorRole.USER};`,
    );
    await queryRunner.query(`DROP ROLE ${DatabaseActorRole.USER};`);

    await queryRunner.query(`DROP ROLE ${DatabaseActorRole.ANON};`);
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM ${DatabaseActorRole.ANON};`,
    );
  }
}
