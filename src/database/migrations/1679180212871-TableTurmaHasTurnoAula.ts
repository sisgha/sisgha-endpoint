import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableTurmaHasTurnoAula1679180212871 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'turma_has_turno_aula',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'id_turma',
            type: 'int',
          },

          {
            name: 'id_turno_aula',
            type: 'int',
          },
        ],

        foreignKeys: [
          {
            name: 'FK_TurmaHasTurnoAula_Turma',
            referencedTableName: 'turma',
            referencedColumnNames: ['id'],
            columnNames: ['id_turma'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'FK_TurmaHasTurnoAula_TurnoAula',
            referencedTableName: 'turno_aula',
            referencedColumnNames: ['id'],
            columnNames: ['id_turno_aula'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      `ALTER TABLE turma_has_turno_aula ENABLE ROW LEVEL SECURITY;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE turma_has_turno_aula DISABLE ROW LEVEL SECURITY;`,
    );

    await queryRunner.dropTable('turma_has_turno_aula', true);
  }
}
