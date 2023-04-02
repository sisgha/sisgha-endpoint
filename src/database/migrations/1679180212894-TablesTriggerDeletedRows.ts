import { MigrationInterface, QueryRunner } from 'typeorm';

const tables = ['cargo'];

export class TablesTriggerDeletedRows1679180212894
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of tables) {
      await queryRunner.query(`
        CREATE TRIGGER ${table}_deleted_rows_trigger
        AFTER DELETE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION log_deleted_rows();
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of tables) {
      await queryRunner.query(`
      DROP TRIGGER ${table}_deleted_rows_trigger ON ${table};
    `);
    }
  }
}
