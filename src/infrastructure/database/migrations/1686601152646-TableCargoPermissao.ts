import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableCargoPermissao1686601152646 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cargo_permissao',

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
            name: 'id_cargo_fk',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_permissao_fk',
            type: 'int',
            isNullable: false,
          },
        ],

        foreignKeys: [
          {
            name: 'FK_CargoPermissao_Cargo',
            referencedTableName: 'cargo',
            referencedColumnNames: ['id'],
            columnNames: ['id_cargo_fk'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'FK_CargoPermissao_Permissao',
            referencedTableName: 'permissao',
            referencedColumnNames: ['id'],
            columnNames: ['id_permissao_fk'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cargo_permissao', true);
  }
}
