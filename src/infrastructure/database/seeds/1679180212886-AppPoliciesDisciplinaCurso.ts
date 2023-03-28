import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPoliciesDisciplinaCurso1679180212886
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read disciplina_curso"
      ON disciplina_curso
      FOR SELECT
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage disciplina_curso"
      ON disciplina_curso
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
      `DROP POLICY "Everyone can read disciplina_curso" ON disciplina_curso;`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user with cargo 'dape' can manage disciplina_curso" ON disciplina_curso;`,
    );
  }
}