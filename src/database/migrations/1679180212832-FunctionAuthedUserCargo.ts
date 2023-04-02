import { MigrationInterface, QueryRunner } from 'typeorm';

export class FunctionAuthedUserCargo1679180212832
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE OR REPLACE FUNCTION authed_user_has_cargo(cargo_slug VARCHAR(100))
      RETURNS TABLE (id INTEGER)
      AS $$
      BEGIN
          RETURN QUERY 
          SELECT uhc.id FROM usuario_has_cargo uhc
          INNER JOIN cargo cargo ON uhc.id_cargo = cargo.id
          INNER JOIN usuario usuario ON uhc.id_usuario = usuario.id
          WHERE (
              (usuario.id = public.auth_user_id()) AND (cargo.slug = cargo_slug)
          );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP FUNCTION authed_user_has_cargo;`);
  }
}
