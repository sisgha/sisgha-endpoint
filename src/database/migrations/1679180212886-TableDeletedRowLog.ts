import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableDeletedRowLog1679180212886 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'deleted_rows_log',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'table_name',
            type: 'TEXT',
            isNullable: false,
          },

          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: false,
          },

          {
            name: 'deleted_row_data',
            type: 'JSONB',
            isNullable: true,
          },

          {
            name: 'meilisearch_synced',
            type: 'BOOLEAN',
            default: 'FALSE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('deleted_rows_log');
  }
}
