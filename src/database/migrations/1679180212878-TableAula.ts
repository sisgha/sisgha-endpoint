import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableAula1679180212878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'aula',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'id_diario',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_semana',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_turno_aula',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'id_lugar',
            type: 'int',
            isNullable: true,
          },
        ],

        foreignKeys: [
          {
            name: 'FK_Aula_Semana',
            columnNames: ['id_semana'],
            referencedTableName: 'semana',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },

          {
            name: 'FK_Aula_Diario',
            columnNames: ['id_diario'],
            referencedTableName: 'diario',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },

          {
            name: 'FK_Aula_TurnoAula',
            columnNames: ['id_turno_aula'],
            referencedTableName: 'turno_aula',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },

          {
            name: 'FK_Aula_Lugar',
            columnNames: ['id_lugar'],
            referencedTableName: 'lugar',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
    await queryRunner.query(`ALTER TABLE aula ENABLE ROW LEVEL SECURITY;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE aula DISABLE ROW LEVEL SECURITY;`);
    await queryRunner.dropTable('aula', true);
  }
}
