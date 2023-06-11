import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPoliciesProfessor1679180212890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read professor"
      ON professor 
      FOR SELECT
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage professor"
      ON professor
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
    await queryRunner.query('DROP POLICY "Everyone can read professor" ON professor;');

    await queryRunner.query('DROP POLICY "Authed user with cargo \'dape\' can manage professor" ON professor;');
  }
}
