import { Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { ActorContext } from 'src/actor-context/ActorContext';
import { APP_RESOURCE_CARGO } from 'src/actor-context/providers';
import { ContextAction } from 'src/authorization/interfaces';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { CargoDbEntity } from '../../../database/entities/cargo.db.entity';
import { getCargoRepository } from '../../../database/repositories/cargo.repository';
import { CargoType } from './cargo.type';
import { ICreateCargoInput, IDeleteCargoInput, IFindCargoByIdInput, IUpdateCargoInput, ListCargoResultType } from './dtos';

@Injectable()
export class CargoService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findCargoById(actorContext: ActorContext, dto: IFindCargoByIdInput, options: FindOneOptions<CargoDbEntity> | null = null) {
    const targetCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      return cargoRepository.findOne({
        where: { id: dto.id },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetCargo) {
      return null;
    }

    const cargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      return cargoRepository.findOneOrFail({
        where: { id: targetCargo.id },
        select: ['id'],
        ...options,
      });
    });

    return actorContext.readResource(APP_RESOURCE_CARGO, cargo);
  }

  async findCargoByIdStrict(actorContext: ActorContext, dto: IFindCargoByIdInput, options: FindOneOptions<CargoDbEntity> | null = null) {
    const cargo = await this.findCargoById(actorContext, dto, options);

    if (!cargo) {
      throw new NotFoundException();
    }

    return cargo;
  }

  async findCargoByIdStrictSimple<T = Pick<CargoDbEntity, 'id'>>(actorContext: ActorContext, cargoId: number): Promise<T> {
    const cargo = await this.findCargoByIdStrict(actorContext, { id: cargoId });
    return <T>cargo;
  }

  async listCargo(actorContext: ActorContext, dto: IGenericListInput): Promise<ListCargoResultType> {
    const allowedIds = await actorContext.getAllowedResourcesIdsForResourceAction(APP_RESOURCE_CARGO, ContextAction.READ);

    const result = await this.meilisearchService.listResource<CargoType>(APP_RESOURCE_CARGO, dto, allowedIds);

    return {
      ...result,
    };
  }

  async getCargoStrictGenericField<K extends keyof CargoDbEntity>(
    actorContext: ActorContext,
    cargoId: number,
    field: K,
  ): Promise<CargoDbEntity[K]> {
    const cargo = await this.findCargoByIdStrict(actorContext, { id: cargoId }, { select: ['id', field] });
    return <CargoDbEntity[K]>cargo[field];
  }

  async getCargoSlug(actorContext: ActorContext, cargoId: number) {
    return this.getCargoStrictGenericField(actorContext, cargoId, 'slug');
  }

  async getCargoCreatedAt(actorContext: ActorContext, cargoId: number) {
    return this.getCargoStrictGenericField(actorContext, cargoId, 'createdAt');
  }

  async getCargoUpdatedAt(actorContext: ActorContext, cargoId: number) {
    return this.getCargoStrictGenericField(actorContext, cargoId, 'updatedAt');
  }

  async getCargoDeletedAt(actorContext: ActorContext, cargoId: number) {
    return this.getCargoStrictGenericField(actorContext, cargoId, 'deletedAt');
  }

  async getCargoSearchSyncAt(actorContext: ActorContext, cargoId: number) {
    return this.getCargoStrictGenericField(actorContext, cargoId, 'searchSyncAt');
  }

  async createCargo(actorContext: ActorContext, dto: ICreateCargoInput) {
    const fieldsData = omit(dto, []);

    const cargo = <CargoDbEntity>{
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_CARGO, ContextAction.CREATE, cargo);

    const dbCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);
      await cargoRepository.save(cargo);
      return <CargoDbEntity>cargo;
    });

    return this.findCargoByIdStrictSimple(actorContext, dbCargo.id);
  }

  async updateCargo(actorContext: ActorContext, dto: IUpdateCargoInput) {
    const cargo = await this.findCargoByIdStrictSimple(actorContext, dto.id);

    const fieldsData = omit(dto, ['id']);

    const updatedCargo = <CargoDbEntity>{
      ...cargo,
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_CARGO, ContextAction.UPDATE, updatedCargo);

    await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);
      await cargoRepository.save(updatedCargo);
      return <CargoDbEntity>updatedCargo;
    });

    return this.findCargoByIdStrictSimple(actorContext, cargo.id);
  }

  async deleteCargo(actorContext: ActorContext, dto: IDeleteCargoInput) {
    const cargo = await this.findCargoByIdStrictSimple(actorContext, dto.id);

    await actorContext.ensurePermission(APP_RESOURCE_CARGO, ContextAction.DELETE, cargo);

    return actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      await cargoRepository
        .createQueryBuilder('cargo')
        .update()
        .set({
          deletedAt: new Date(),
        })
        .where('id = :id', { id: cargo.id })
        .execute();
    });
  }
}
