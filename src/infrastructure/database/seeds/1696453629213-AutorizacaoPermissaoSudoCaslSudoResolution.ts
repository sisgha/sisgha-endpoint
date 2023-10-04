import { IAuthorizationConstraintRecipeBoolean } from '#recipe-guard-core';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { PermissaoModel } from '../../../domain/models/permissao.model';
import { getPermissaoRepository } from '../repositories/permissao.repository';

export class AutorizacaoPermissaoSudoCaslSudoResolution1696453629213 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissaoRepository = getPermissaoRepository(queryRunner.manager);

    const permissaoSudoCasl: Partial<PermissaoModel> = {
      descricao: 'sudo_casl',

      verboGlobal: true,
      recursoGlobal: true,

      authorizationConstraintRecipe: <IAuthorizationConstraintRecipeBoolean>{
        resolutionMode: 'casl_only',
        type: 'boolean',
        value: true,
      },
    };

    await permissaoRepository.save(permissaoSudoCasl);

    const permissaoSudoResolution: Partial<PermissaoModel> = {
      descricao: 'sudo_resolution',

      verboGlobal: true,
      recursoGlobal: true,

      authorizationConstraintRecipe: <IAuthorizationConstraintRecipeBoolean>{
        resolutionMode: 'merge',
        type: 'boolean',
        value: true,
      },
    };

    await permissaoRepository.save(permissaoSudoResolution);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const permissaoRepository = getPermissaoRepository(queryRunner.manager);

    await permissaoRepository.delete({
      descricao: 'sudo_resolution',
    });

    await permissaoRepository.delete({
      descricao: 'sudo_casl',
    });
  }
}
