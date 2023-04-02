import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableTurnoAula1679180212850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'turno_aula',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'id_dia_semana',
            type: 'int',
          },

          {
            name: 'id_periodo_dia',
            type: 'int',
          },
        ],

        foreignKeys: [
          {
            name: 'FK_TurnoAula_DiaSemana',
            referencedTableName: 'dia_semana',
            referencedColumnNames: ['id'],
            columnNames: ['id_dia_semana'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'FK_TurnoAula_PeriodoDia',
            referencedTableName: 'periodo_dia',
            referencedColumnNames: ['id'],
            columnNames: ['id_periodo_dia'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      `ALTER TABLE turno_aula ENABLE ROW LEVEL SECURITY;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE turno_aula DISABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.dropTable('turno_aula', true);
  }
}
