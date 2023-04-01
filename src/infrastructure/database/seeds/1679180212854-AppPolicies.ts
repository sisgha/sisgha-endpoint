import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPolicies1679180212854 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read cargo" 
      ON cargo 
      FOR SELECT
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage cargo"
      ON cargo 
      FOR ALL 
      TO authenticated 
      USING (
        EXISTS (
          SELECT * FROM authed_user_has_cargo('dape')
        )
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user can read itself"
      ON usuario 
      FOR SELECT
      USING (
        id = public.auth_user_id()
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage usuario"
      ON usuario
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT * FROM authed_user_has_cargo('dape')
        )
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user can read own usuario_has_cargo"
      ON usuario_has_cargo
      FOR SELECT
      USING (
        id_usuario = public.auth_user_id()
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage usuario_has_cargo"
      ON usuario_has_cargo
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
    await queryRunner.query(`DROP POLICY "Everyone can read cargo" ON cargo;`);

    await queryRunner.query(
      `DROP POLICY "Authed user with cargo 'dape' can manage cargo" ON cargo;`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user can read itself" ON usuario;`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user with cargo 'dape' can manage usuario" ON usuario;`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user can read own usuario_has_cargo" ON usuario_has_cargo;`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user with cargo 'dape' can manage usuario_has_cargo" ON usuario_has_cargo`,
    );
  }
}
