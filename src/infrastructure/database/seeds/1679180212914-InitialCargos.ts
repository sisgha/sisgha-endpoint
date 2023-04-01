import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialCargos1679180212914 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO public.cargo
      (id, slug)
      VALUES(1, 'dape');
    `);

    await queryRunner.query(`
    INSERT INTO public.cargo
      (id, slug)
      VALUES(2, 'professor');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM public.cargo
      WHERE id=2;
    `);

    await queryRunner.query(`
    DELETE FROM public.cargo
      WHERE id=1;
    `);
  }
}
