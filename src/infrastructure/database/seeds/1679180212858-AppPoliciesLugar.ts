import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPoliciesLugar1679180212858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read lugar"
      ON lugar
      FOR SELECT
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage lugar"
      ON lugar
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
    await queryRunner.query(`DROP POLICY "Everyone can read lugar" ON lugar;`);

    await queryRunner.query(
      `DROP POLICY "Authed user with cargo 'dape' can manage lugar" ON lugar;`,
    );
  }
}
