import { MigrationInterface, QueryRunner } from 'typeorm';
import { SemanaStatus } from '../../../app/modules/semana/interfaces/SemanaStatus';

export class AppPoliciesSemana1679180212874 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read semana that have status of publico"
      ON semana
      FOR SELECT
      USING (
        status = '${SemanaStatus.PUBLICO}'
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage semana"
      ON semana
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
      `DROP POLICY "Everyone can read semana that have status of publico" ON semana;`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user with cargo 'dape' can manage semana" ON semana;`,
    );
  }
}
