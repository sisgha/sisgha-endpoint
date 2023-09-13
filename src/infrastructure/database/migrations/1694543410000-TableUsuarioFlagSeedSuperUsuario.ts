import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class TableUsuarioFlagSeedSuperUsuario1694543410000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usuarioTable = await queryRunner.getTable('usuario');

    if (usuarioTable) {
      await queryRunner.addColumn(
        usuarioTable,
        new TableColumn({
          name: 'flag_seed_super_usuario',
          type: 'boolean',
          default: 'FALSE',
        }),
      );
    } else {
      throw new Error('Table usuario was not found');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const usuarioTable = await queryRunner.getTable('usuario');

    if (usuarioTable) {
      await queryRunner.dropColumn(usuarioTable, 'flag_seed_super_usuario');
    } else {
      throw new Error('Table usuario was not found');
    }
  }
}
