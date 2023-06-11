import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableAtorCargo1679180212866 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ator_cargo',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          // ...

          {
            name: 'id_ator_fk',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_cargo_fk',
            type: 'int',
            isNullable: false,
          },
        ],

        foreignKeys: [
          {
            name: 'FK_AtorCargo_Ator',
            referencedTableName: 'ator',
            referencedColumnNames: ['id'],
            columnNames: ['id_ator_fk'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_AtorCargo_Cargo',
            referencedTableName: 'cargo',
            referencedColumnNames: ['id'],
            columnNames: ['id_cargo_fk'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ator_cargo', true);
  }
}
