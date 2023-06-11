import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TablePermissao1679180212830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permissao',

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
            name: 'descricao',
            type: 'text',
            isNullable: true,
          },

          {
            name: 'acao',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'recurso',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'constraint',
            type: 'json',
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
    await queryRunner.dropTable('permissao', true);
  }
}
