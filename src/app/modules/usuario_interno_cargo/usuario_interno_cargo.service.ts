import { Injectable, NotFoundException } from '@nestjs/common';
import { intersection } from 'lodash';
import { ActorContext } from 'src/actor-context/ActorContext';
import { APP_RESOURCE_CARGO, APP_RESOURCE_USUARIO_INTERNO_CARGO } from 'src/actor-context/providers';
import { ContextAction } from 'src/authorization/interfaces';
import { UsuarioInternoCargoDbEntity } from 'src/database/entities/usuario_interno_cargo.db.entity';
import { getUsuarioInternoRepository } from 'src/database/repositories/usuario_interno.repository';
import { getUsuarioInternoCargoRepository } from 'src/database/repositories/usuario_interno_cargo.repository';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { extractIds } from '../../../common/extract-ids';
import { getCargoRepository } from '../../../database/repositories/cargo.repository';
import { CargoService } from '../cargo/cargo.service';
import { CargoType } from '../cargo/cargo.type';
import { ListCargoResultType } from '../cargo/dtos';
import { UsuarioInternoService } from '../usuario_interno/usuario_interno.service';
import {
  IAddCargoToUsuarioInternoInput,
  IFindUsuarioInternoCargoByIdInput,
  IFindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInput,
  IListCargoFromUsuarioInternoInput,
  IRemoveCargoFromUsuarioInternoInput,
} from './dtos';

@Injectable()
export class UsuarioInternoCargoService {
  constructor(
    // ...
    private cargoService: CargoService,
    private usuarioInternoService: UsuarioInternoService,
    private meilisearchService: MeiliSearchService,
  ) {}

  async findUsuarioInternoCargoById(
    actorContext: ActorContext,
    dto: IFindUsuarioInternoCargoByIdInput,
    options: FindOneOptions<UsuarioInternoCargoDbEntity> | null = null,
  ) {
    const targetUsuarioInternoCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioInternoCargoRepository = getUsuarioInternoCargoRepository(entityManager);

      return usuarioInternoCargoRepository.findOne({
        where: { id: dto.id },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetUsuarioInternoCargo) {
      return null;
    }

    const usuarioInternoCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioInternoCargoRepository = getUsuarioInternoCargoRepository(entityManager);

      return usuarioInternoCargoRepository.findOneOrFail({
        where: { id: targetUsuarioInternoCargo.id },
        select: ['id'],
        ...options,
      });
    });

    return actorContext.readResource(APP_RESOURCE_USUARIO_INTERNO_CARGO, usuarioInternoCargo);
  }

  async findUsuarioInternoCargoByIdStrict(
    actorContext: ActorContext,
    dto: IFindUsuarioInternoCargoByIdInput,
    options: FindOneOptions<UsuarioInternoCargoDbEntity> | null = null,
  ) {
    const usuarioInternoCargo = await this.findUsuarioInternoCargoById(actorContext, dto, options);

    if (!usuarioInternoCargo) {
      throw new NotFoundException();
    }

    return usuarioInternoCargo;
  }

  async findUsuarioInternoCargoByIdStrictSimple<T = Pick<UsuarioInternoCargoDbEntity, 'id'>>(
    actorContext: ActorContext,
    usuarioInternoCargoId: number,
  ): Promise<T> {
    const usuarioInternoCargo = await this.findUsuarioInternoCargoByIdStrict(actorContext, { id: usuarioInternoCargoId });
    return <T>usuarioInternoCargo;
  }

  async findUsuarioInternoCargoByUsuarioInternoIdAndCargoId(
    actorContext: ActorContext,
    dto: IFindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInput,
    options: FindOneOptions<UsuarioInternoCargoDbEntity> | null = null,
  ) {
    const targetCargo = await this.cargoService.findCargoByIdStrictSimple(actorContext, dto.cargoId);

    const targetUsuarioInterno = await this.usuarioInternoService.findUsuarioInternoByIdStrictSimple(actorContext, dto.usuarioInternoId);

    const targetUsuarioInternoCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioInternoCargoRepository = getUsuarioInternoCargoRepository(entityManager);

      return usuarioInternoCargoRepository.findOne({
        where: {
          cargo: {
            id: targetCargo.id,
          },
          usuarioInterno: {
            id: targetUsuarioInterno.id,
          },
        },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetUsuarioInternoCargo) {
      return null;
    }

    return this.findUsuarioInternoCargoById(actorContext, { id: targetUsuarioInternoCargo.id }, options);
  }

  async findUsuarioInternoCargoByUsuarioInternoIdAndCargoIdStrict(
    actorContext: ActorContext,
    dto: IFindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInput,
    options: FindOneOptions<UsuarioInternoCargoDbEntity> | null = null,
  ) {
    const usuarioInternoCargo = await this.findUsuarioInternoCargoByUsuarioInternoIdAndCargoId(actorContext, dto, options);

    if (!usuarioInternoCargo) {
      throw new NotFoundException();
    }

    return usuarioInternoCargo;
  }

  async listCargoFromUsuarioInterno(actorContext: ActorContext, dto: IListCargoFromUsuarioInternoInput): Promise<ListCargoResultType> {
    const usuarioInterno = await this.usuarioInternoService.findUsuarioInternoByIdStrictSimple(actorContext, dto.usuarioInternoId);

    const allowedCargoIds = await actorContext.getAllowedResourcesIdsForResourceAction(APP_RESOURCE_CARGO, ContextAction.READ);

    const allCargoIdsForUsuarioInterno = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      const qb = await cargoRepository.createQueryBuilderForUsuarioInternoId(usuarioInterno.id);

      qb.select(['cargo.id']);

      const cargos = await qb.getMany();

      const ids = extractIds(cargos);

      return ids;
    });

    const targetCargoIds = intersection(allowedCargoIds, allCargoIdsForUsuarioInterno);

    const result = await this.meilisearchService.listResource<CargoType>(APP_RESOURCE_CARGO, dto, targetCargoIds);

    return {
      ...result,
    };
  }

  async getUsuarioInternoCargoStrictGenericField<K extends keyof UsuarioInternoCargoDbEntity>(
    actorContext: ActorContext,
    usuarioInternoCargoId: number,
    field: K,
  ): Promise<UsuarioInternoCargoDbEntity[K]> {
    const usuarioInternoCargo = await this.findUsuarioInternoCargoByIdStrict(
      actorContext,
      { id: usuarioInternoCargoId },
      { select: ['id', field] },
    );

    return <UsuarioInternoCargoDbEntity[K]>usuarioInternoCargo[field];
  }

  async getUsuarioInternoCargoCargo(actorContext: ActorContext, usuarioInternoCargoId: number) {
    const usuarioInternoCargo = await this.findUsuarioInternoCargoByIdStrictSimple(actorContext, usuarioInternoCargoId);

    const cargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      const qb = cargoRepository
        .createQueryBuilder('cargo')
        .select(['cargo.id'])
        .innerJoin('cargo.usuarioInternoCargo', 'usuario_interno_cargo')
        .where('usuario_interno_cargo.id = :usuarioInternoCargoId', { usuarioInternoCargoId: usuarioInternoCargo.id });

      const cargo = await qb.getOneOrFail();

      return cargo;
    });

    return cargo;
  }

  async getUsuarioInternoCargoUsuarioInterno(actorContext: ActorContext, usuarioInternoCargoId: number) {
    const usuarioInternoCargo = await this.findUsuarioInternoCargoByIdStrictSimple(actorContext, usuarioInternoCargoId);

    const usuarioInterno = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioInternoRepository = getUsuarioInternoRepository(entityManager);

      const qb = usuarioInternoRepository
        .createQueryBuilder('usuario_interno')
        .select(['usuario_interno.id'])
        .innerJoin('usuario_interno.usuarioInternoCargo', 'usuario_interno_cargo')
        .where('usuario_interno_cargo.id = :usuarioInternoCargoId', { usuarioInternoCargoId: usuarioInternoCargo.id });

      const usuario = await qb.getOneOrFail();

      return usuario;
    });

    return usuarioInterno;
  }

  async addCargoToUsuarioInterno(actorContext: ActorContext, dto: IAddCargoToUsuarioInternoInput) {
    const cargo = await this.cargoService.findCargoByIdStrictSimple(actorContext, dto.cargoId);
    const usuarioInterno = await this.usuarioInternoService.findUsuarioInternoByIdStrictSimple(actorContext, dto.usuarioInternoId);

    const usuarioInternoCargoExists = await this.findUsuarioInternoCargoByUsuarioInternoIdAndCargoId(actorContext, {
      cargoId: cargo.id,
      usuarioInternoId: usuarioInterno.id,
    });

    if (usuarioInternoCargoExists) {
      return usuarioInternoCargoExists;
    }

    const usuarioInternoCargo = <UsuarioInternoCargoDbEntity>{
      cargo: {
        id: cargo.id,
      },
      usuarioInterno: {
        id: usuarioInterno.id,
      },
    };

    await actorContext.ensurePermission(APP_RESOURCE_USUARIO_INTERNO_CARGO, ContextAction.CREATE, usuarioInternoCargo);

    const dbUsuarioInternoCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioInternoCargoRepository = getUsuarioInternoCargoRepository(entityManager);
      await usuarioInternoCargoRepository.save(usuarioInternoCargo);
      return <UsuarioInternoCargoDbEntity>usuarioInternoCargo;
    });

    return this.findUsuarioInternoCargoByIdStrictSimple(actorContext, dbUsuarioInternoCargo.id);
  }

  async removeCargoFromUsuarioInterno(actorContext: ActorContext, dto: IRemoveCargoFromUsuarioInternoInput) {
    const cargo = await this.cargoService.findCargoByIdStrictSimple(actorContext, dto.cargoId);
    const usuarioInterno = await this.usuarioInternoService.findUsuarioInternoByIdStrictSimple(actorContext, dto.usuarioInternoId);

    const usuarioInternoCargoAlreadyExists = await this.findUsuarioInternoCargoByUsuarioInternoIdAndCargoId(actorContext, {
      cargoId: cargo.id,
      usuarioInternoId: usuarioInterno.id,
    });

    if (usuarioInternoCargoAlreadyExists) {
      await actorContext.ensurePermission(APP_RESOURCE_USUARIO_INTERNO_CARGO, ContextAction.DELETE, usuarioInternoCargoAlreadyExists);

      await actorContext.databaseRun(async ({ entityManager }) => {
        const usuarioInternoCargoRepository = getUsuarioInternoCargoRepository(entityManager);
        await usuarioInternoCargoRepository.delete(usuarioInternoCargoAlreadyExists.id);
      });
    }

    return true;
  }
}
