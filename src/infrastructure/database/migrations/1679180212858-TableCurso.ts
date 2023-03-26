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
            type: 'varchar',
            length: '200',
          },

          {
            name: 'tipo',
            type: 'varchar',
            length: '200',
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
