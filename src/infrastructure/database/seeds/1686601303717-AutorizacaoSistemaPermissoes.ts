import { MigrationInterface, QueryRunner } from 'typeorm';
import { IAuthorizationConstraintRecipeBoolean } from '../../../domain/authorization-constraints';
import { PermissaoModel } from '../../../domain/models/permissao.model';
import { getPermissaoRepository } from '../repositories/permissao.repository';

export class AutorizacaoSistemaPermissoes1686601303717 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissaoRepository = getPermissaoRepository(queryRunner.manager);

    const permissao: Partial<PermissaoModel> = {
      descricao: 'manage_all',

      acao: 'manage',
      recurso: 'all',

      constraint: <IAuthorizationConstraintRecipeBoolean>{
        type: 'boolean',
        value: true,
      },
    };

    await permissaoRepository.save(permissao);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const permissaoRepository = getPermissaoRepository(queryRunner.manager);

    await permissaoRepository.delete({
      descricao: 'manage_all',
    });
  }
}
