import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import MeiliSearch from 'meilisearch';
import { AppContext } from 'src/app-context/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { INDEX_CARGO } from 'src/meilisearch/constants/meilisearch-tokens';
import { MEILISEARCH_CLIENT } from 'src/meilisearch/constants/MEILISEARCH_CLIENT.const';
import { FindOneOptions } from 'typeorm';
import { CargoDbEntity } from '../../../database/entities/cargo.db.entity';
import { getCargoRepository } from '../../../database/repositories/cargo.repository';
import { CargoType } from './cargo.type';
import {
  ICreateCargoInput,
  IDeleteCargoInput,
  IFindCargoByIdInput,
  IUpdateCargoInput,
} from './dtos';
import { IListCargoInput } from './dtos/ListCargoInput';
import { ListCargoResultType } from './dtos/ListCargoResult';

@Injectable()
export class CargoService {
  constructor(
    @Inject(MEILISEARCH_CLIENT)
    private meilisearchClient: MeiliSearch,
  ) {}

  async findCargoById(
    appContext: AppContext,
    dto: IFindCargoByIdInput,
    options: FindOneOptions<CargoDbEntity> | null = null,
  ) {
    const { id } = dto;

    const targetCargo = await appContext.databaseRun(
      async ({ entityManager }) => {
        const cargoRepository = getCargoRepository(entityManager);

        return cargoRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetCargo) {
      return null;
    }

    const cargo = await appContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      return cargoRepository.findOneOrFail({
        where: { id: targetCargo.id },
        select: ['id'],
        ...options,
      });
    });

    return cargo;
  }

  async findCargoByIdStrict(
    appContext: AppContext,
    dto: IFindCargoByIdInput,
    options: FindOneOptions<CargoDbEntity> | null = null,
  ) {
    const cargo = await this.findCargoById(appContext, dto, options);

    if (!cargo) {
      throw new NotFoundException();
    }

    return cargo;
  }

  async listCargo(
    appContext: AppContext,
    dto: IListCargoInput,
  ): Promise<ListCargoResultType> {
    const { query, limit, offset } = dto;

    const result = await this.meilisearchClient
      .index(INDEX_CARGO)
      .search<CargoType>(query, { limit, offset });

    const items = await parralelMap(result.hits, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const cargo = await this.findCargoById(appContext, {
          id: hit.id,
        });

        if (cargo) {
          return cargo;
        }
      }

      return null;
    });

    const listCargoResult: ListCargoResultType = {
      query: result.query,

      limit: result.limit,
      offset: result.offset,

      total: result.estimatedTotalHits,

      items: items,
    };

    return listCargoResult;
  }

  async findCargoByIdStrictSimple<T = Pick<CargoDbEntity, 'id'>>(
    appContext: AppContext,
    cargoId: number,
  ): Promise<T> {
    const cargo = await this.findCargoByIdStrict(appContext, { id: cargoId });
    return <T>cargo;
  }

  async getCargoStrictGenericField<K extends keyof CargoDbEntity>(
    appContext: AppContext,
    cargoId: number,
    field: K,
  ): Promise<CargoDbEntity[K]> {
    const cargo = await this.findCargoByIdStrict(
      appContext,
      { id: cargoId },
      { select: ['id', field] },
    );

    return <CargoDbEntity[K]>cargo[field];
  }

  async getCargoSlug(appContext: AppContext, cargoId: number) {
    return this.getCargoStrictGenericField(appContext, cargoId, 'slug');
  }

  async createCargo(appContext: AppContext, dto: ICreateCargoInput) {
    const fieldsData = omit(dto, []);

    const cargo = await appContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      const cargo = { ...fieldsData };
      await cargoRepository.save(cargo);

      return <CargoDbEntity>cargo;
    });

    return this.findCargoByIdStrictSimple(appContext, cargo.id);
  }

  async updateCargo(appContext: AppContext, dto: IUpdateCargoInput) {
    const { id } = dto;

    const cargo = await this.findCargoByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    await appContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      const updatedCargo = { ...cargo, ...fieldsData };
      await cargoRepository.save(updatedCargo);

      return <CargoDbEntity>updatedCargo;
    });

    return this.findCargoByIdStrictSimple(appContext, cargo.id);
  }

  async deleteCargo(appContext: AppContext, dto: IDeleteCargoInput) {
    const { id } = dto;

    const cargo = await this.findCargoByIdStrictSimple(appContext, id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      try {
        await cargoRepository.delete(cargo.id);

        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
