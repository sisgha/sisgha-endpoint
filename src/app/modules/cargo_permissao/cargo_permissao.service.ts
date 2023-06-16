import { Injectable, NotFoundException } from '@nestjs/common';
import { intersection } from 'lodash';
import { ActorContext } from 'src/actor-context/ActorContext';
import { APP_RESOURCE_CARGO_PERMISSAO, APP_RESOURCE_PERMISSAO } from 'src/actor-context/providers';
import { ContextAction } from 'src/authorization/interfaces';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { extractIds } from '../../../common/extract-ids';
import { CargoPermissaoDbEntity } from '../../../database/entities/cargo_permissao.db.entity';
import { getCargoRepository } from '../../../database/repositories/cargo.repository';
import { getCargoPermissaoRepository } from '../../../database/repositories/cargo_permissao.repository';
import { getPermissaoRepository } from '../../../database/repositories/permissao.repository';
import { CargoService } from '../cargo/cargo.service';
import { ListPermissaoResultType } from '../permissao/dtos';
import { PermissaoService } from '../permissao/permissao.service';
import { PermissaoType } from '../permissao/permissao.type';
import {
  IAddPermissaoToCargoInput,
  IFindCargoPermissaoByCargoIdAndPermissaoIdInput,
  IListPermissaoFromCargoInput,
  IRemovePermissaoFromCargoInput,
} from './dtos';
import { IFindCargoPermissaoByIdInput } from './dtos/FindCargoPermissaoByIdInput';

@Injectable()
export class CargoPermissaoService {
  constructor(
    // ...
    private cargoService: CargoService,
    private permissaoService: PermissaoService,
    private meilisearchService: MeiliSearchService,
  ) {}

  async findCargoPermissaoById(
    actorContext: ActorContext,
    dto: IFindCargoPermissaoByIdInput,
    options: FindOneOptions<CargoPermissaoDbEntity> | null = null,
  ) {
    const targetCargoPermissao = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoPermissaoRepository = getCargoPermissaoRepository(entityManager);

      return cargoPermissaoRepository.findOne({
        where: { id: dto.id },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetCargoPermissao) {
      return null;
    }

    const cargoPermissao = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoPermissaoRepository = getCargoPermissaoRepository(entityManager);

      return cargoPermissaoRepository.findOneOrFail({
        where: { id: targetCargoPermissao.id },
        select: ['id'],
        ...options,
      });
    });

    return actorContext.readResource(APP_RESOURCE_CARGO_PERMISSAO, cargoPermissao);
  }

  async findCargoPermissaoByIdStrict(
    actorContext: ActorContext,
    dto: IFindCargoPermissaoByIdInput,
    options: FindOneOptions<CargoPermissaoDbEntity> | null = null,
  ) {
    const cargoPermissao = await this.findCargoPermissaoById(actorContext, dto, options);

    if (!cargoPermissao) {
      throw new NotFoundException();
    }

    return cargoPermissao;
  }

  async findCargoPermissaoByIdStrictSimple<T = Pick<CargoPermissaoDbEntity, 'id'>>(
    actorContext: ActorContext,
    cargoPermissaoId: number,
  ): Promise<T> {
    const cargoPermissao = await this.findCargoPermissaoByIdStrict(actorContext, { id: cargoPermissaoId });
    return <T>cargoPermissao;
  }

  async findCargoPermissaoByCargoIdAndPermissaoId(
    actorContext: ActorContext,
    dto: IFindCargoPermissaoByCargoIdAndPermissaoIdInput,
    options: FindOneOptions<CargoPermissaoDbEntity> | null = null,
  ) {
    const targetCargo = await this.cargoService.findCargoByIdStrictSimple(actorContext, dto.cargoId);

    const targetPermissao = await this.permissaoService.findPermissaoByIdStrictSimple(actorContext, dto.permissaoId);

    const targetCargoPermissao = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoPermissaoRepository = getCargoPermissaoRepository(entityManager);

      return cargoPermissaoRepository.findOne({
        where: {
          cargo: {
            id: targetCargo.id,
          },
          permissao: {
            id: targetPermissao.id,
          },
        },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetCargoPermissao) {
      return null;
    }

    return this.findCargoPermissaoById(actorContext, { id: targetCargoPermissao.id }, options);
  }

  async findCargoPermissaoByCargoIdAndPermissaoIdStrict(
    actorContext: ActorContext,
    dto: IFindCargoPermissaoByCargoIdAndPermissaoIdInput,
    options: FindOneOptions<CargoPermissaoDbEntity> | null = null,
  ) {
    const cargoPermissao = await this.findCargoPermissaoByCargoIdAndPermissaoId(actorContext, dto, options);

    if (!cargoPermissao) {
      throw new NotFoundException();
    }

    return cargoPermissao;
  }

  async listPermissoesFromCargo(actorContext: ActorContext, dto: IListPermissaoFromCargoInput): Promise<ListPermissaoResultType> {
    const cargo = await this.cargoService.findCargoByIdStrictSimple(actorContext, dto.cargoId);

    const allowedPermissaoIds = await actorContext.getAllowedResourcesIdsForResourceAction(APP_RESOURCE_PERMISSAO, ContextAction.READ);

    const allPermissoesIdsForCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      const qb = await permissaoRepository.createQueryBuilderForCargoId(cargo.id);

      qb.select(['permissao.id']);

      const permissoes = await qb.getMany();

      const ids = extractIds(permissoes);

      return ids;
    });

    const targetPermissaoIds = intersection(allowedPermissaoIds, allPermissoesIdsForCargo);

    const result = await this.meilisearchService.listResource<PermissaoType>(APP_RESOURCE_PERMISSAO, dto, targetPermissaoIds);

    return {
      ...result,
    };
  }

  async getCargoPermissaoStrictGenericField<K extends keyof CargoPermissaoDbEntity>(
    actorContext: ActorContext,
    cargoPermissaoId: number,
    field: K,
  ): Promise<CargoPermissaoDbEntity[K]> {
    const cargoPermissao = await this.findCargoPermissaoByIdStrict(actorContext, { id: cargoPermissaoId }, { select: ['id', field] });
    return <CargoPermissaoDbEntity[K]>cargoPermissao[field];
  }

  async getCargoPermissaoCargo(actorContext: ActorContext, cargoPermissaoId: number) {
    const cargoPermissao = await this.findCargoPermissaoByIdStrictSimple(actorContext, cargoPermissaoId);

    const cargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      const qb = cargoRepository
        .createQueryBuilder('cargo')
        .select(['cargo.id'])
        .innerJoin('cargo.cargoPermissao', 'cargo_permissao')
        .where('cargo_permissao.id = :cargoPermissaoId', { cargoPermissaoId: cargoPermissao.id });

      const cargo = await qb.getOneOrFail();

      return cargo;
    });

    return cargo;
  }

  async getCargoPermissaoPermissao(actorContext: ActorContext, cargoPermissaoId: number) {
    const cargoPermissao = await this.findCargoPermissaoByIdStrictSimple(actorContext, cargoPermissaoId);

    const permissao = await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      const qb = permissaoRepository
        .createQueryBuilder('permissao')
        .select(['permissao.id'])
        .innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .where('cargo_permissao.id = :cargoPermissaoId', { cargoPermissaoId: cargoPermissao.id });

      const permissao = await qb.getOneOrFail();

      return permissao;
    });

    return permissao;
  }

  async addPermissaoToCargo(actorContext: ActorContext, dto: IAddPermissaoToCargoInput) {
    const cargo = await this.cargoService.findCargoByIdStrictSimple(actorContext, dto.cargoId);
    const permissao = await this.permissaoService.findPermissaoByIdStrictSimple(actorContext, dto.permissaoId);

    const cargoPermissaoExists = await this.findCargoPermissaoByCargoIdAndPermissaoId(actorContext, {
      cargoId: cargo.id,
      permissaoId: permissao.id,
    });

    if (cargoPermissaoExists) {
      return cargoPermissaoExists;
    }

    const cargoPermissao = <CargoPermissaoDbEntity>{
      cargo: {
        id: cargo.id,
      },
      permissao: {
        id: permissao.id,
      },
    };

    await actorContext.ensurePermission(APP_RESOURCE_CARGO_PERMISSAO, ContextAction.CREATE, cargoPermissao);

    const dbCargoPermissao = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoPermissaoRepository = getCargoPermissaoRepository(entityManager);
      await cargoPermissaoRepository.save(cargoPermissao);
      return <CargoPermissaoDbEntity>cargoPermissao;
    });

    return this.findCargoPermissaoByIdStrictSimple(actorContext, dbCargoPermissao.id);
  }

  async removePermissaoFromCargo(actorContext: ActorContext, dto: IRemovePermissaoFromCargoInput) {
    const cargo = await this.cargoService.findCargoByIdStrictSimple(actorContext, dto.cargoId);
    const permissao = await this.permissaoService.findPermissaoByIdStrictSimple(actorContext, dto.permissaoId);

    const cargoPermissaoAlreadyExists = await this.findCargoPermissaoByCargoIdAndPermissaoId(actorContext, {
      cargoId: cargo.id,
      permissaoId: permissao.id,
    });

    if (cargoPermissaoAlreadyExists) {
      await actorContext.ensurePermission(APP_RESOURCE_CARGO_PERMISSAO, ContextAction.DELETE, cargoPermissaoAlreadyExists);

      await actorContext.databaseRun(async ({ entityManager }) => {
        const cargoPermissaoRepository = getCargoPermissaoRepository(entityManager);
        await cargoPermissaoRepository.delete(cargoPermissaoAlreadyExists.id);
      });
    }

    return true;
  }
}
