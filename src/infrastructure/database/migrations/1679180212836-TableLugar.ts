import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableLugar1679180212836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lugar',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'numero',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },

          {
            name: 'tipo',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },

          {
            name: 'descricao',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.query(`ALTER TABLE lugar ENABLE ROW LEVEL SECURITY;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE lugar DISABLE ROW LEVEL SECURITY;`);

    await queryRunner.dropTable('lugar', true);
  }
}
