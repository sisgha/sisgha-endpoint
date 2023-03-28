import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableTurma1679180212870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'turma',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'periodo',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'turno',
            type: 'text',
            isNullable: true,
          },

          {
            name: 'id_curso',
            type: 'int',
          },

          {
            name: 'id_lugar_padrao',
            type: 'int',
            isNullable: true,
          },
        ],

        foreignKeys: [
          {
            name: 'FK_Turma_Curso',
            referencedTableName: 'curso',
            referencedColumnNames: ['id'],
            columnNames: ['id_curso'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'FK_Turma_Lugar_Padrao',
            referencedTableName: 'lugar',
            referencedColumnNames: ['id'],
            columnNames: ['id_lugar_padrao'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(`ALTER TABLE turma ENABLE ROW LEVEL SECURITY;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE turma DISABLE ROW LEVEL SECURITY;`);
    await queryRunner.dropTable('turma', true);
  }
}
