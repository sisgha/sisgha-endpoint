 import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableDiario1679180212874 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'diario',

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
            name: 'id_disciplina',
            type: 'int',
          },
        ],

        foreignKeys: [
          {
            name: 'FK_Diario_Turma',
            referencedTableName: 'turma',
            referencedColumnNames: ['id'],
            columnNames: ['id_turma'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'FK_Diario_Disciplina',
            referencedTableName: 'disciplina',
            referencedColumnNames: ['id'],
            columnNames: ['id_disciplina'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(`ALTER TABLE diario ENABLE ROW LEVEL SECURITY;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE diario DISABLE ROW LEVEL SECURITY;`);
    await queryRunner.dropTable('diario', true);
  }
}
