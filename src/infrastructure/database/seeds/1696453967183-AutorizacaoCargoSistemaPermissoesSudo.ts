import { MigrationInterface, QueryRunner } from 'typeorm';
import { getCargoRepository } from '../repositories/cargo.repository';
import { getCargoPermissaoRepository } from '../repositories/cargo_permissao.repository';
import { getPermissaoRepository } from '../repositories/permissao.repository';

export class AutorizacaoCargoSistemaPermissoesSudo1696453967183 implements MigrationInterface {
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

    const permissaoSudoCasl = await permissaoRepository.findOneOrFail({
      where: {
        descricao: 'sudo_casl',
      },
    });

    const permissaoSudoResolution = await permissaoRepository.findOneOrFail({
      where: {
        descricao: 'sudo_resolution',
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

    await cargoPermissaoRepository.save({
      cargo: cargoSistema,
      permissao: permissaoSudoCasl,
    });

    await cargoPermissaoRepository.save({
      cargo: cargoSistema,
      permissao: permissaoSudoResolution,
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

    const permissaoSudoCasl = await permissaoRepository.findOneOrFail({
      where: {
        descricao: 'sudo_casl',
      },
    });

    const permissaoSudoResolution = await permissaoRepository.findOneOrFail({
      where: {
        descricao: 'sudo_resolution',
      },
    });

    await cargoPermissaoRepository.delete({
      cargo: {
        id: cargoSistema.id,
      },
      permissao: {
        id: permissaoSudoResolution.id,
      },
    });

    await cargoPermissaoRepository.delete({
      cargo: {
        id: cargoSistema.id,
      },
      permissao: {
        id: permissaoSudoCasl.id,
      },
    });

    await cargoPermissaoRepository.save({
      cargo: cargoSistema,
      permissao: permissaoManageAll,
    });
  }
}
