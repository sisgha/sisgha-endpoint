import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableAtor1679180212860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ator',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          // ...

          {
            name: 'tipo',
            type: 'text',
            isNullable: false,
          },

          // ...

          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },

          {
            name: 'search_sync_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ator', true);
  }
}
