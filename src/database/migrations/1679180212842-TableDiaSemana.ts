import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableDiaSeamana1679180212842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dia_semana',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'ordem',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.query(
      `ALTER TABLE dia_semana ENABLE ROW LEVEL SECURITY;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE dia_semana DISABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.dropTable('dia_semana', true);
  }
}
