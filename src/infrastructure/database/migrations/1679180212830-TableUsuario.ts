import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableUsuario1679180212830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuario',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'keycloak_id',
            type: 'char',
            length: '36',
            isNullable: true,
          },

          {
            name: 'matricula_siape',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },

          {
            name: 'email',
            type: 'varchar',
            length: '400',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.query(`ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;`);

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

    await queryRunner.query(`ALTER TABLE usuario DISABLE ROW LEVEL SECURITY;`);
    await queryRunner.dropTable('usuario', true);
  }
}
