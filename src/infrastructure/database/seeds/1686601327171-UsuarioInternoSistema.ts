import { MigrationInterface, QueryRunner } from 'typeorm';
import { AuthenticatedEntityType } from '../../../domain/authentication';
import { getUsuarioInternoRepository } from '../repositories/usuario_interno.repository';

export class UsuarioInternoSistema1686601327171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usuarioInternoRepository = getUsuarioInternoRepository(queryRunner.manager);

    await usuarioInternoRepository.save({
      tipoEntidade: AuthenticatedEntityType.SYSTEM,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const usuarioInternoRepository = getUsuarioInternoRepository(queryRunner.manager);

    await usuarioInternoRepository.delete({
      tipoEntidade: AuthenticatedEntityType.SYSTEM,
    });
  }
}
