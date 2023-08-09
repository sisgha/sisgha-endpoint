import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableUsuarioCargo1686601167002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuario_cargo',

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
            name: 'id_usuario_fk',
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
            name: 'FK_UsuarioCargo_Usuario',
            referencedTableName: 'usuario',
            referencedColumnNames: ['id'],
            columnNames: ['id_usuario_fk'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_UsuarioCargo_Cargo',
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
    await queryRunner.dropTable('usuario_cargo', true);
  }
}
