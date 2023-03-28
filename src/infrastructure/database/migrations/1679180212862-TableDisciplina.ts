import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableDisciplina1679180212862 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'disciplina',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'nome',
            type: 'text',
          },

          {
            name: 'id_lugar_padrao',
            type: 'int',
            isNullable: true,
          },
        ],

        foreignKeys: [
          {
            name: 'FK_Disciplina_Lugar_Padrao',
            referencedTableName: 'lugar',
            referencedColumnNames: ['id'],
            columnNames: ['id_lugar_padrao'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      `ALTER TABLE disciplina ENABLE ROW LEVEL SECURITY;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE disciplina DISABLE ROW LEVEL SECURITY;`,
    );

    await queryRunner.dropTable('disciplina', true);
  }
}
