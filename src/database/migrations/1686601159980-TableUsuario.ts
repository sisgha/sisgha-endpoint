import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableUsuario1686601159980 implements MigrationInterface {
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

          // ...

          {
            name: 'email',
            type: 'text',
            isNullable: true,
          },

          {
            name: 'matricula_siape',
            type: 'text',
            isNullable: true,
          },

          //

          {
            name: 'keycloak_id',
            type: 'char',
            length: '36',
            isNullable: true,
          },

          // ...

          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },

          {
            name: 'search_sync_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuario', true);
  }
}
