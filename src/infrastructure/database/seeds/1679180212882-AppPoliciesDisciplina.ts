import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPoliciesDisciplina1679180212882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read disciplina"
      ON disciplina 
      FOR SELECT 
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage disciplina"
      ON disciplina
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
      `DROP POLICY "Everyone can read disciplina" ON disciplina;`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user with cargo 'dape' can manage disciplina" ON disciplina;`,
    );
  }
}
