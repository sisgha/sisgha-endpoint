import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableUsuarioHasCargo1679180212831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuario_has_cargo',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'id_usuario',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_cargo',
            type: 'int',
            isNullable: false,
          },
        ],

        foreignKeys: [
          {
            name: 'FK_UsuarioHasCargo_Usuario',
            referencedTableName: 'usuario',
            referencedColumnNames: ['id'],
            columnNames: ['id_usuario'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'FK_UsuarioHasCargo_Cargo',
            referencedTableName: 'cargo',
            referencedColumnNames: ['id'],
            columnNames: ['id_cargo'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      `ALTER TABLE usuario_has_cargo ENABLE ROW LEVEL SECURITY;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE usuario_has_cargo DISABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.dropTable('usuario_has_cargo', true);
  }
}
