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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE usuario DISABLE ROW LEVEL SECURITY;`);
    await queryRunner.dropTable('usuario', true);
  }
}
