import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPoliciesDiaSemana1679180212862 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read dia_semana"
      ON dia_semana
      FOR SELECT
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage dia_semana"
      ON dia_semana
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
    await queryRunner.query('DROP POLICY "Everyone can read dia_semana" ON dia_semana;');

    await queryRunner.query('DROP POLICY "Authed user with cargo \'dape\' can manage dia_semana" ON dia_semana;');
  }
}
