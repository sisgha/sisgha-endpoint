import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TablePermissao1686601130444 implements MigrationInterface {
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
            isNullable: false,
            isUnique: true,
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
    await queryRunner.dropTable('permissao', true);
  }
}
