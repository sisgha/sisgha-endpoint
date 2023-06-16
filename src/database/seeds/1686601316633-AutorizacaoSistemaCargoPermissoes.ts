import { MigrationInterface, QueryRunner } from 'typeorm';
import { getCargoRepository } from '../repositories/cargo.repository';
import { getCargoPermissaoRepository } from '../repositories/cargo_permissao.repository';
import { getPermissaoRepository } from '../repositories/permissao.repository';

export class AutorizacaoSistemaCargoPermissoes1686601316633 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const cargoRepository = getCargoRepository(queryRunner.manager);
    const permissaoRepository = getPermissaoRepository(queryRunner.manager);
    const cargoPermissaoRepository = getCargoPermissaoRepository(queryRunner.manager);

    const cargoSistema = await cargoRepository.findOneOrFail({
      where: {
        slug: 'sistema',
      },
    });

    const permissaoManageAll = await permissaoRepository.findOneOrFail({
      where: {
        descricao: 'manage_all',
      },
    });

    await cargoPermissaoRepository.save({
      cargo: cargoSistema,
      permissao: permissaoManageAll,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const cargoRepository = getCargoRepository(queryRunner.manager);
    const permissaoRepository = getPermissaoRepository(queryRunner.manager);
    const cargoPermissaoRepository = getCargoPermissaoRepository(queryRunner.manager);

    const cargoSistema = await cargoRepository.findOneOrFail({
      where: {
        slug: 'sistema',
      },
    });

    const permissaoManageAll = await permissaoRepository.findOneOrFail({
      where: {
        descricao: 'manage_all',
      },
    });

    await cargoPermissaoRepository.delete({
      cargo: {
        id: cargoSistema.id,
      },
      permissao: {
        id: permissaoManageAll.id,
      },
    });
  }
}
