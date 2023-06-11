import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPoliciesRemaining1679180212899 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read curso"
      ON curso
      FOR SELECT 
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage curso"
      ON curso
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
    await queryRunner.query('DROP POLICY "Everyone can read curso" ON curso;');

    await queryRunner.query('DROP POLICY "Authed user with cargo \'dape\' can manage curso" ON curso;');
  }
}
