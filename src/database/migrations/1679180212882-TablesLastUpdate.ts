import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const TARGET_TABLES = ['cargo', 'usuario', ''];

export class TablesLastUpdate1679180212882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of TARGET_TABLES) {
      await queryRunner.addColumns(table, [
        new TableColumn({
          name: 'last_update',
          type: 'timestamptz',
          isNullable: true,
        }),

        new TableColumn({
          name: 'last_search_sync',
          type: 'timestamptz',
          isNullable: true,
        }),
      ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of TARGET_TABLES) {
      await queryRunner.dropColumn(table, 'last_update');
      await queryRunner.dropColumn(table, 'last_search_sync');
    }
  }
}
