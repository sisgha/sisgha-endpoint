import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TablePeriodoDia1679180212846 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'periodo_dia',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'hora_inicio',
            type: 'timetz',
            isNullable: false,
          },

          {
            name: 'hora_fim',
            type: 'timetz',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.query(
      `ALTER TABLE periodo_dia ENABLE ROW LEVEL SECURITY;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE periodo_dia DISABLE ROW LEVEL SECURITY;`,
    );

    await queryRunner.dropTable('periodo_dia', true);
  }
}
