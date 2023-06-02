import { Injectable, NotFoundException } from '@nestjs/common';
import { AppContext } from 'src/app/AppContext/AppContext';
import { CargoDbEntity } from 'src/database/entities/cargo.db.entity';
import { UsuarioHasCargoDbEntity } from 'src/database/entities/usuario-has-cargo.db.entity';
import { UsuarioDbEntity } from 'src/database/entities/usuario.db.entity';
import { getCargoRepository } from 'src/database/repositories/cargo.repository';
import { getUsuarioHasCargoRepository } from 'src/database/repositories/usuario-has-cargo.repository';
import { getUsuarioRepository } from 'src/database/repositories/usuario.repository';
import { FindOneOptions } from 'typeorm';

import { isNil } from 'lodash';
import { parralelMap } from 'src/common/utils/parralel-map';
import { INDEX_USUARIO_HAS_CARGO } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import {
  IAddCargoToUsuarioInput,
  IFindUsuarioHasCargoByIdInput,
  IFindUsuarioHasCargoByUsuarioIdAndCargoIdInput,
  IRemoveCargoFromUsuarioInput,
  ListUsuarioHasCargoResultType,
} from './dtos';
import { UsuarioHasCargoType } from './usuario-has-cargo.type';

@Injectable()
export class UsuarioHasCargoService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findUsuarioHasCargoById(
    appContext: AppContext,
    dto: IFindUsuarioHasCargoByIdInput,
    options?: FindOneOptions<UsuarioHasCargoDbEntity>,
  ) {
    const { id } = dto;

    const targetUsuarioHasCargo = await appContext.databaseRun(
      async ({ entityManager }) => {
        const usuarioHasCargoRepository =
          getUsuarioHasCargoRepository(entityManager);

        return usuarioHasCargoRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetUsuarioHasCargo) {
      return null;
    }

    const usuarioHasCargo =
      await appContext.databaseRun<UsuarioHasCargoDbEntity>(
        async ({ entityManager }) => {
          const usuarioHasCargoRepository =
            getUsuarioHasCargoRepository(entityManager);

          return await usuarioHasCargoRepository.findOneOrFail({
            where: { id: targetUsuarioHasCargo.id },
            select: ['id'],
            ...options,
          });
        },
      );

    return usuarioHasCargo;
  }

  async findUsuarioHasCargoByIdStrict(
    appContext: AppContext,
    dto: IFindUsuarioHasCargoByIdInput,
    options?: FindOneOptions<UsuarioHasCargoDbEntity>,
  ) {
    const usuarioHasCargo = await this.findUsuarioHasCargoById(
      appContext,
      dto,
      options,
    );

    if (!usuarioHasCargo) {
      throw new NotFoundException();
    }

    return usuarioHasCargo;
  }

  async findUsuarioHasCargoByIdStrictSimple(
    appContext: AppContext,
    usuarioHasCargoId: number,
  ): Promise<Pick<UsuarioHasCargoDbEntity, 'id'>> {
    const usuarioHasCargo = await this.findUsuarioHasCargoByIdStrict(
      appContext,
      {
        id: usuarioHasCargoId,
      },
    );

    return usuarioHasCargo as Pick<UsuarioHasCargoDbEntity, 'id'>;
  }

  async findUsuarioHasCargoByUsuarioIdAndCargoId(
    appContext: AppContext,
    dto: IFindUsuarioHasCargoByUsuarioIdAndCargoIdInput,
  ): Promise<UsuarioHasCargoDbEntity | null> {
    const { cargoId, usuarioId } = dto;

    const usuarioHasCargo = await appContext.databaseRun(
      async ({ entityManager }) => {
        const usuarioHasCargoRepository =
          getUsuarioHasCargoRepository(entityManager);

        return usuarioHasCargoRepository
          .createQueryBuilder('uhc')
          .innerJoin('uhc.usuario', 'usuario')
          .innerJoin('uhc.cargo', 'cargo')
          .where('usuario.id = :usuarioId', { usuarioId })
          .andWhere('cargo.id = :cargoId', { cargoId })
          .select(['uhc.id'])
          .getOne();
      },
    );

    return usuarioHasCargo;
  }

  async findUsuarioHasCargoByUsuarioIdAndCargoIdStrict(
    appContext: AppContext,
    dto: IFindUsuarioHasCargoByUsuarioIdAndCargoIdInput,
  ): Promise<UsuarioHasCargoDbEntity> {
    const usuarioHasCargo = await this.findUsuarioHasCargoByUsuarioIdAndCargoId(
      appContext,
      dto,
    );

    if (!usuarioHasCargo) {
      throw new NotFoundException();
    }

    return usuarioHasCargo;
  }

  async listUsuarioHasCargo(
    appContext: AppContext,
    dto: IGenericListInput,
  ): Promise<ListUsuarioHasCargoResultType> {
    const result =
      await this.meilisearchService.listResource<UsuarioHasCargoType>(
        INDEX_USUARIO_HAS_CARGO,
        dto,
      );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findUsuarioHasCargoById(appContext, {
          id: hit.id,
        });

        if (row) {
          return row;
        }
      }

      return null;
    });

    return {
      ...result,
      items,
    };
  }

  async getUsuarioHasCargoStrictGenericField<
    K extends keyof UsuarioHasCargoDbEntity,
  >(
    appContext: AppContext,
    usuarioHasCargoId: number,
    field: K,
  ): Promise<UsuarioHasCargoDbEntity[K]> {
    const usuarioHasCargo = await this.findUsuarioHasCargoByIdStrict(
      appContext,
      { id: usuarioHasCargoId },
      { select: ['id', field] },
    );

    return <UsuarioHasCargoDbEntity[K]>usuarioHasCargo[field];
  }

  async getUsuarioHasCargoUsuario(
    appContext: AppContext,
    usuarioHasCargoId: number,
  ) {
    const usuario = await appContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return usuarioRepository
        .createQueryBuilder('usuario')
        .innerJoin('usuario.usuarioHasCargo', 'uhc')
        .where('uhc.id = :usuarioHasCargoId', { usuarioHasCargoId })
        .select(['usuario.id'])
        .getOne();
    });

    return usuario;
  }

  async getUsuarioHasCargoCargo(
    appContext: AppContext,
    usuarioHasCargoId: number,
  ) {
    const cargo = await appContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      return cargoRepository
        .createQueryBuilder('cargo')
        .innerJoin('cargo.usuarioHasCargo', 'uhc')
        .where('uhc.id = :usuarioHasCargoId', { usuarioHasCargoId })
        .select(['cargo.id'])
        .getOne();
    });

    return cargo;
  }

  async addCargoToUsuario(
    appContext: AppContext,
    dto: IAddCargoToUsuarioInput,
  ) {
    const { usuarioId, cargoId } = dto;

    const usuarioHasCargoAlreadyExists =
      await this.findUsuarioHasCargoByUsuarioIdAndCargoId(appContext, {
        cargoId,
        usuarioId,
      });

    if (usuarioHasCargoAlreadyExists) {
      return usuarioHasCargoAlreadyExists;
    }

    const usuarioHasCargo = <UsuarioHasCargoDbEntity>{};

    usuarioHasCargo.cargo = <CargoDbEntity>{ id: cargoId };
    usuarioHasCargo.usuario = <UsuarioDbEntity>{ id: usuarioId };

    await appContext.databaseRun(async ({ entityManager }) => {
      const usuarioHasCargoRepository =
        getUsuarioHasCargoRepository(entityManager);

      await usuarioHasCargoRepository.save(usuarioHasCargo);

      return usuarioHasCargo;
    });

    return this.findUsuarioHasCargoByIdStrictSimple(
      appContext,
      usuarioHasCargo.id,
    );
  }

  async removeCargoFromUsuario(
    appContext: AppContext,
    dto: IRemoveCargoFromUsuarioInput,
  ) {
    const usuarioHasCargo = await this.findUsuarioHasCargoByUsuarioIdAndCargoId(
      appContext,
      { cargoId: dto.cargoId, usuarioId: dto.usuarioId },
    );

    if (!usuarioHasCargo) {
      return true;
    }

    return appContext.databaseRun(async ({ entityManager }) => {
      const usuarioHasCargoRepository =
        getUsuarioHasCargoRepository(entityManager);

      try {
        await usuarioHasCargoRepository.delete(usuarioHasCargo.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
