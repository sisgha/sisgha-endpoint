import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPoliciesDiario1679180212902 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read diario"
      ON diario 
      FOR SELECT
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage diario"
      ON diario
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
      `DROP POLICY "Everyone can read diario" ON diario;`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user with cargo 'dape' can manage diario" ON diario;`,
    );
  }
}
