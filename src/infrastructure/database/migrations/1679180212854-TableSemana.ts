import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { SemanaStatus } from '../../../app/modules/semana/interfaces/SemanaStatus';

export class TableSemana1679180212854 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'semana',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'data_inicio',
            type: 'timestamptz',
            isNullable: false,
          },

          {
            name: 'data_fim',
            type: 'timestamptz',
            isNullable: false,
          },

          {
            name: 'status',
            type: 'enum',
            default: `'${SemanaStatus.RASCUNHO}'`,
            enum: [SemanaStatus.RASCUNHO, SemanaStatus.PUBLICO],
          },
        ],
      }),
    );

    await queryRunner.query(`ALTER TABLE semana ENABLE ROW LEVEL SECURITY;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE semana DISABLE ROW LEVEL SECURITY;`);

    await queryRunner.dropTable('semana', true);
  }
}
