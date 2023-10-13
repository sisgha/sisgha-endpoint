import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableCurso1697136953149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'curso',

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
            name: 'nome',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'nome_abreviado',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'id_modalidade_fk',
            type: 'int',
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
        foreignKeys: [
          {
            name: 'FK_curso_modalidade',
            columnNames: ['id_modalidade_fk'],
            referencedTableName: 'modalidade',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('curso', true);
  }
}
