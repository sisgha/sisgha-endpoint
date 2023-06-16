import { MigrationInterface, QueryRunner } from 'typeorm';
import { ActorType } from '../../actor-context/interfaces';
import { getUsuarioInternoRepository } from '../repositories/usuario_interno.repository';

export class UsuarioInternoSistema1686601327171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usuarioInternoRepository = getUsuarioInternoRepository(queryRunner.manager);

    await usuarioInternoRepository.save({
      tipoAtor: ActorType.SYSTEM,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const usuarioInternoRepository = getUsuarioInternoRepository(queryRunner.manager);

    await usuarioInternoRepository.delete({
      tipoAtor: ActorType.SYSTEM,
    });
  }
}
