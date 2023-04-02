import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableDisciplinaCurso1679180212863 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'disciplina_curso',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'id_disciplina',
            type: 'int',
          },

          {
            name: 'id_curso',
            type: 'int',
          },
        ],

        foreignKeys: [
          {
            name: 'FK_DisciplinaCurso_Disciplina',
            referencedTableName: 'disciplina',
            referencedColumnNames: ['id'],
            columnNames: ['id_disciplina'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'FK_DisciplinaCurso_Curso',
            referencedTableName: 'curso',
            referencedColumnNames: ['id'],
            columnNames: ['id_curso'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      `ALTER TABLE disciplina_curso ENABLE ROW LEVEL SECURITY;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE disciplina_curso DISABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.dropTable('disciplina_curso', true);
  }
}
