import { MigrationInterface, QueryRunner } from 'typeorm';

export class FunctionLogDeletedRows1679180212890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION log_deleted_rows()
      RETURNS TRIGGER AS $$
      BEGIN
          INSERT INTO deleted_rows_log (table_name, deleted_at, deleted_row_data)
          VALUES (TG_TABLE_NAME, NOW(), to_jsonb(OLD));
          RETURN OLD;
      END;
      $$ LANGUAGE plpgsql;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP FUNCTION log_deleted_rows();
    `);
  }
}
