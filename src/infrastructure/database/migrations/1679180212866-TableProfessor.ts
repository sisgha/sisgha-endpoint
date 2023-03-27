import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableProfessor1679180212866 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'professor',

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
        ],
      }),
    );

    await queryRunner.query(`ALTER TABLE professor ENABLE ROW LEVEL SECURITY;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE professor DISABLE ROW LEVEL SECURITY;`,
    );

    await queryRunner.dropTable('professor', true);
  }
}
