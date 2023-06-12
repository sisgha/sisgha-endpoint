import { MigrationInterface, QueryRunner } from 'typeorm';
import { getPermissaoRepository } from '../repositories/permissao.repository';

export class AutorizacaoSistemaPermissoes1686601303717 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissaoRepository = getPermissaoRepository(queryRunner.manager);

    await permissaoRepository.save({
      descricao: 'manage_all',
      acao: 'manage',
      recurso: 'all',
      constraint: true,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const permissaoRepository = getPermissaoRepository(queryRunner.manager);

    await permissaoRepository.delete({
      descricao: 'manage_all',
    });
  }
}
