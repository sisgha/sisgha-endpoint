import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableCargo1686601144260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cargo',

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
            name: 'slug',
            type: 'text',
            isUnique: true,
            isNullable: false,
          },

          // ...

          {
            name: 'date_created',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'date_updated',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'date_deleted',
            type: 'timestamptz',
            isNullable: true,
          },

          {
            name: 'date_search_sync',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cargo', true);
  }
}
