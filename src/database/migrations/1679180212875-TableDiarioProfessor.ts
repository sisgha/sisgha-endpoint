import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableDiarioProfessor1679180212875 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'diario_professor',

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
          },

          {
            name: 'id_professor',
            type: 'int',
          },
        ],

        foreignKeys: [
          {
            name: 'FK_DiarioProfessor_Diario',
            referencedTableName: 'diario',
            referencedColumnNames: ['id'],
            columnNames: ['id_diario'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'FK_DiarioProfessor_Professor',
            referencedTableName: 'professor',
            referencedColumnNames: ['id'],
            columnNames: ['id_professor'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      `ALTER TABLE diario_professor ENABLE ROW LEVEL SECURITY;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE diario_professor DISABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.dropTable('diario_professor', true);
  }
}
