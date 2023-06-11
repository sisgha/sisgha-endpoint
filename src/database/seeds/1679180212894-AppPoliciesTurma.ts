import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPoliciesTurma1679180212894 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read turma"
      ON turma 
      FOR SELECT
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage turma"
      ON turma
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
    await queryRunner.query('DROP POLICY "Everyone can read turma" ON turma;');

    await queryRunner.query('DROP POLICY "Authed user with cargo \'dape\' can manage turma" ON turma;');
  }
}
