import { MigrationInterface, QueryRunner } from 'typeorm';
import { ActorType } from '../../actor-context/interfaces';
import { getCargoRepository } from '../repositories/cargo.repository';
import { getUsuarioInternoRepository } from '../repositories/usuario_interno.repository';
import { getUsuarioInternoCargoRepository } from '../repositories/usuario_interno_cargo.repository';

export class UsuarioInternoSistemaCargos1686601333480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const cargoRepository = getCargoRepository(queryRunner.manager);
    const usuarioInternoRepository = getUsuarioInternoRepository(queryRunner.manager);
    const usuarioInternoCargoRepository = getUsuarioInternoCargoRepository(queryRunner.manager);

    const usuarioInternoSistema = await usuarioInternoRepository.findOneOrFail({
      where: {
        tipoAtor: ActorType.SYSTEM,
      },
    });

    const cargoSistema = await cargoRepository.findOneOrFail({
      where: {
        slug: 'sistema',
      },
    });

    await usuarioInternoCargoRepository.save({
      usuarioInterno: usuarioInternoSistema,
      cargo: cargoSistema,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const cargoRepository = getCargoRepository(queryRunner.manager);
    const usuarioInternoRepository = getUsuarioInternoRepository(queryRunner.manager);
    const usuarioInternoCargoRepository = getUsuarioInternoCargoRepository(queryRunner.manager);

    const usuarioInternoSistema = await usuarioInternoRepository.findOneOrFail({
      where: {
        tipoAtor: 'sistema',
      },
    });

    const cargoSistema = await cargoRepository.findOneOrFail({
      where: {
        slug: 'sistema',
      },
    });

    await usuarioInternoCargoRepository.delete({
      usuarioInterno: {
        id: usuarioInternoSistema.id,
      },
      cargo: {
        id: cargoSistema.id,
      },
    });
  }
}
