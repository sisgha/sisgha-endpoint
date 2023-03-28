import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableCurso1679180212858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'curso',

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
            name: 'tipo',
            type: 'text',
          },
        ],
      }),
    );

    await queryRunner.query(`ALTER TABLE curso ENABLE ROW LEVEL SECURITY;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE curso DISABLE ROW LEVEL SECURITY;`);

    await queryRunner.dropTable('curso', true);
  }
}
