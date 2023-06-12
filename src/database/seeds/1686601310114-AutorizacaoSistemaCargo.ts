import { MigrationInterface, QueryRunner } from 'typeorm';
import { getCargoRepository } from '../repositories/cargo.repository';

export class AutorizacaoSistemaCargo1686601310114 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const cargoRepository = getCargoRepository(queryRunner.manager);

    await cargoRepository.save({
      slug: 'sistema',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const cargoRepository = getCargoRepository(queryRunner.manager);

    await cargoRepository.delete({
      slug: 'sistema',
    });
  }
}
