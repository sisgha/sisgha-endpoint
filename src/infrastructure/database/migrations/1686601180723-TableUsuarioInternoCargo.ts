import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableUsuarioInternoCargo1686601180723 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuario_interno_cargo',

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
            name: 'id_usuario_interno_fk',
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
            name: 'FK_UsuarioInternoCargo_UsuarioInterno',
            referencedTableName: 'usuario_interno',
            referencedColumnNames: ['id'],
            columnNames: ['id_usuario_interno_fk'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_UsuarioInternoCargo_Cargo',
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
    await queryRunner.dropTable('usuario_interno_cargo', true);
  }
}
