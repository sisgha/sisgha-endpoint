import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPoliciesTurmaHasTurnoAula1679180212898
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read turma_has_turno_aula"
      ON turma_has_turno_aula 
      FOR SELECT
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage turma_has_turno_aula"
      ON turma_has_turno_aula
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT * FROM authed_user_has_cargo('dape')
        )
      );
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP POLICY "Everyone can read turma_has_turno_aula" ON turma_has_turno_aula;`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user with cargo 'dape' can manage turma_has_turno_aula" ON turma_has_turno_aula;`,
    );
  }
}
