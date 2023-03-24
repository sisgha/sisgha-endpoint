import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableCargo1679180212828 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cargo',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'slug',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
        ],
      }),
    );

    await queryRunner.query(`ALTER TABLE cargo ENABLE ROW LEVEL SECURITY;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE cargo DISABLE ROW LEVEL SECURITY;`);
    await queryRunner.dropTable('cargo', true);
  }
}
