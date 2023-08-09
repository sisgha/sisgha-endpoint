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
            name: 'verbo_global',
            type: 'boolean',
            isNullable: false,
            default: 'FALSE',
          },

          {
            name: 'recurso_global',
            type: 'boolean',
            isNullable: false,
            default: 'FALSE',
          },

          {
            name: 'authorization_constraint_recipe',
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

    await queryRunner.createTable(
      new Table({
        name: 'permissao_verbo',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'verbo',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'id_permissao_fk',
            type: 'int',
            isNullable: false,
          },
        ],

        foreignKeys: [
          {
            name: 'FK_permissao_verbo_permissao',
            columnNames: ['id_permissao_fk'],
            referencedTableName: 'permissao',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'permissao_recurso',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'recurso',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'id_permissao_fk',
            type: 'int',
            isNullable: false,
          },
        ],

        foreignKeys: [
          {
            name: 'FK_permissao_recurso_permissao',
            columnNames: ['id_permissao_fk'],
            referencedTableName: 'permissao',
            referencedColumnNames: ['id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permissao_recurso', true);
    await queryRunner.dropTable('permissao_verbo', true);
    await queryRunner.dropTable('permissao', true);
  }
}
