import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const TARGET_TABLES = [
  'aula',
  'cargo',
  'curso',
  'dia_semana',
  'diario',
  'diario_professor',
  'disciplina',
  'disciplina_curso',
  'lugar',
  'periodo_dia',
  'professor',
  'semana',
  'turma',
  'turma_has_turno_aula',
  'turno_aula',
  'usuario',
  'usuario_has_cargo',
];

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
