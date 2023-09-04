import { Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { FindOneOptions } from 'typeorm';
import { ContextAction } from '../../../../domain/authorization-constraints';
import {
  ICreateCargoInput,
  IDeleteCargoInput,
  IFindCargoByIdInput,
  IFindCargoBySlugInput,
  IUpdateCargoInput,
} from '../../../../domain/dtos';
import { IGenericListInput } from '../../../../domain/search/IGenericListInput';
import { ActorContext } from '../../../actor-context/ActorContext';
import { CargoDbEntity } from '../../../database/entities/cargo.db.entity';
import { getCargoRepository } from '../../../database/repositories/cargo.repository';
import { MeiliSearchService } from '../../../meilisearch/meilisearch.service';
import { CargoType, ListCargoResultType } from '../../dtos/graphql';
import { APP_RESOURCE_CARGO } from './cargo.resource';

@Injectable()
export class CargoService {
  constructor(
    // ...
    private meiliSearchService: MeiliSearchService,
  ) {}

  // ...

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

  async findCargoBySlug(actorContext: ActorContext, dto: IFindCargoBySlugInput, options: FindOneOptions<CargoDbEntity> | null = null) {
    const targetCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      return cargoRepository.findOne({
        where: { slug: dto.slug },
        select: ['id'],
        cache: 20,
      });
    });

    if (targetCargo) {
      return this.findCargoById(actorContext, { id: targetCargo.id }, options);
    }

    return null;
  }

  async findCargoBySlugStrict(
    actorContext: ActorContext,
    dto: IFindCargoBySlugInput,
    options: FindOneOptions<CargoDbEntity> | null = null,
  ) {
    const cargo = await this.findCargoBySlug(actorContext, dto, options);

    if (!cargo) {
      throw new NotFoundException();
    }

    return cargo;
  }

  async findCargoBySlugStrictSimple<T = Pick<CargoDbEntity, 'id'>>(
    actorContext: ActorContext,
    cargoSlug: IFindCargoBySlugInput['slug'],
  ): Promise<T> {
    const cargo = await this.findCargoBySlugStrict(actorContext, { slug: cargoSlug });
    return <T>cargo;
  }

  //

  async listCargo(actorContext: ActorContext, dto: IGenericListInput): Promise<ListCargoResultType> {
    const allowedIds = await actorContext.getAllowedIdsByRecursoVerbo(APP_RESOURCE_CARGO, ContextAction.READ);

    const result = await this.meiliSearchService.listResource<CargoType>(APP_RESOURCE_CARGO, dto, allowedIds);

    return {
      ...result,
    };
  }

  // ...

  async getCargoStrictGenericField<K extends keyof CargoDbEntity>(
    actorContext: ActorContext,
    cargoId: number,
    field: K,
  ): Promise<CargoDbEntity[K]> {
    const cargo = await this.findCargoByIdStrict(actorContext, { id: cargoId }, { select: ['id', field] });

    return <CargoDbEntity[K]>cargo[field];
  }

  //

  async getCargoSlug(actorContext: ActorContext, cargoId: number) {
    return this.getCargoStrictGenericField(actorContext, cargoId, 'slug');
  }

  async getCargoDateCreated(actorContext: ActorContext, cargoId: number) {
    return this.getCargoStrictGenericField(actorContext, cargoId, 'dateCreated');
  }

  async getCargoDateUpdated(actorContext: ActorContext, cargoId: number) {
    return this.getCargoStrictGenericField(actorContext, cargoId, 'dateUpdated');
  }

  async getCargoDateDeleted(actorContext: ActorContext, cargoId: number) {
    return this.getCargoStrictGenericField(actorContext, cargoId, 'dateDeleted');
  }

  async getCargoDateSearchSync(actorContext: ActorContext, cargoId: number) {
    return this.getCargoStrictGenericField(actorContext, cargoId, 'dateSearchSync');
  }

  // ...

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

    await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      await cargoRepository
        .createQueryBuilder('cargo')
        .update()
        .set({
          dateDeleted: new Date(),
        })
        .where('id = :id', { id: cargo.id })
        .execute();
    });

    return true;
  }
}
