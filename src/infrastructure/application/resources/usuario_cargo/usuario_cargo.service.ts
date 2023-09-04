import { Injectable, NotFoundException } from '@nestjs/common';
import { intersection } from 'lodash';
import { FindOneOptions } from 'typeorm';
import { ContextAction } from '../../../../domain/authorization-constraints';
import {
  IAddCargoToUsuarioInput,
  IChecarUsuarioPossuiCargoByUsuarioidAndCargoSlugInput,
  IFindUsuarioCargoByIdInput,
  IFindUsuarioCargoByUsuarioIdAndCargoIdInput,
  IListCargoFromUsuarioInput,
  IRemoveCargoFromUsuarioInput,
} from '../../../../domain/dtos';
import { ActorContext } from '../../../actor-context/ActorContext';
import { CargoDbEntity } from '../../../database/entities/cargo.db.entity';
import { UsuarioCargoDbEntity } from '../../../database/entities/usuario_cargo.db.entity';
import { getCargoRepository } from '../../../database/repositories/cargo.repository';
import { getUsuarioRepository } from '../../../database/repositories/usuario.repository';
import { getUsuarioCargoRepository } from '../../../database/repositories/usuario_cargo.repository';
import { extractIds } from '../../../helpers/extract-ids';
import { MeiliSearchService } from '../../../meilisearch/meilisearch.service';
import { CargoType, ListCargoResultType } from '../../dtos/graphql';
import { APP_RESOURCE_CARGO } from '../cargo/cargo.resource';
import { CargoService } from '../cargo/cargo.service';
import { UsuarioService } from '../usuario/usuario.service';
import { APP_RESOURCE_USUARIO_CARGO } from './usuario_cargo.resource';

@Injectable()
export class UsuarioCargoService {
  constructor(
    // ...
    private cargoService: CargoService,
    private usuarioService: UsuarioService,
    private meilisearchService: MeiliSearchService,
  ) {}

  async findUsuarioCargoById(
    actorContext: ActorContext,
    dto: IFindUsuarioCargoByIdInput,
    options: FindOneOptions<UsuarioCargoDbEntity> | null = null,
  ) {
    const targetUsuarioCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioCargoRepository = getUsuarioCargoRepository(entityManager);

      return usuarioCargoRepository.findOne({
        where: { id: dto.id },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetUsuarioCargo) {
      return null;
    }

    const usuarioCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioCargoRepository = getUsuarioCargoRepository(entityManager);

      return usuarioCargoRepository.findOneOrFail({
        where: { id: targetUsuarioCargo.id },
        select: ['id'],
        ...options,
      });
    });

    return actorContext.readResource(APP_RESOURCE_USUARIO_CARGO, usuarioCargo);
  }

  async findUsuarioCargoByIdStrict(
    actorContext: ActorContext,
    dto: IFindUsuarioCargoByIdInput,
    options: FindOneOptions<UsuarioCargoDbEntity> | null = null,
  ) {
    const usuarioCargo = await this.findUsuarioCargoById(actorContext, dto, options);

    if (!usuarioCargo) {
      throw new NotFoundException();
    }

    return usuarioCargo;
  }

  async findUsuarioCargoByIdStrictSimple<T = Pick<UsuarioCargoDbEntity, 'id'>>(
    actorContext: ActorContext,
    usuarioCargoId: number,
  ): Promise<T> {
    const usuarioCargo = await this.findUsuarioCargoByIdStrict(actorContext, { id: usuarioCargoId });
    return <T>usuarioCargo;
  }

  async findUsuarioCargoByUsuarioIdAndCargoId(
    actorContext: ActorContext,
    dto: IFindUsuarioCargoByUsuarioIdAndCargoIdInput,
    options: FindOneOptions<UsuarioCargoDbEntity> | null = null,
  ) {
    const targetCargo = await this.cargoService.findCargoByIdStrictSimple(actorContext, dto.cargoId);

    const targetUsuario = await this.usuarioService.findUsuarioByIdStrictSimple(actorContext, dto.usuarioId);

    const targetUsuarioCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioCargoRepository = getUsuarioCargoRepository(entityManager);

      return usuarioCargoRepository.findOne({
        where: {
          cargo: {
            id: targetCargo.id,
          },
          usuario: {
            id: targetUsuario.id,
          },
        },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetUsuarioCargo) {
      return null;
    }

    return this.findUsuarioCargoById(actorContext, { id: targetUsuarioCargo.id }, options);
  }

  async findUsuarioCargoByUsuarioIdAndCargoIdStrict(
    actorContext: ActorContext,
    dto: IFindUsuarioCargoByUsuarioIdAndCargoIdInput,
    options: FindOneOptions<UsuarioCargoDbEntity> | null = null,
  ) {
    const usuarioCargo = await this.findUsuarioCargoByUsuarioIdAndCargoId(actorContext, dto, options);

    if (!usuarioCargo) {
      throw new NotFoundException();
    }

    return usuarioCargo;
  }

  async listCargoFromUsuario(actorContext: ActorContext, dto: IListCargoFromUsuarioInput): Promise<ListCargoResultType> {
    const usuario = await this.usuarioService.findUsuarioByIdStrictSimple(actorContext, dto.usuarioId);

    const allowedCargoIds = await actorContext.getAllowedIdsByRecursoVerbo(APP_RESOURCE_CARGO, ContextAction.READ);

    const allCargoIdsForUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      const qb = await cargoRepository.createQueryBuilderForUsuarioId(usuario.id);

      qb.select(['cargo.id']);

      const cargos = <Pick<CargoDbEntity, 'id'>[]>await qb.getMany();

      const ids = extractIds(cargos);

      return ids;
    });

    const targetCargoIds = intersection(allowedCargoIds, allCargoIdsForUsuario);

    const result = await this.meilisearchService.listResource<CargoType>(APP_RESOURCE_CARGO, dto, targetCargoIds);

    return {
      ...result,
    };
  }

  async checarUsuarioPossuiCargoByUsuarioIdAndCargoSlug(
    actorContext: ActorContext,
    dto: IChecarUsuarioPossuiCargoByUsuarioidAndCargoSlugInput,
  ) {
    const usuario = await this.usuarioService.findUsuarioByIdStrictSimple(actorContext, dto.usuarioId);

    const cargo = await this.cargoService.findCargoBySlugStrictSimple(actorContext, dto.cargoSlug);

    const usuarioDateDeleted = await this.usuarioService.getUsuarioDateDeleted(actorContext, usuario.id);
    const cargoDateDeleted = await this.cargoService.getCargoDateDeleted(actorContext, cargo.id);

    if (!usuarioDateDeleted && !cargoDateDeleted) {
      const usuarioCargo = await this.findUsuarioCargoByUsuarioIdAndCargoId(actorContext, { usuarioId: usuario.id, cargoId: cargo.id });

      if (usuarioCargo) {
        return true;
      }
    }

    return false;
  }
  async getUsuarioCargoStrictGenericField<K extends keyof UsuarioCargoDbEntity>(
    actorContext: ActorContext,
    usuarioCargoId: number,
    field: K,
  ): Promise<UsuarioCargoDbEntity[K]> {
    const usuarioCargo = await this.findUsuarioCargoByIdStrict(actorContext, { id: usuarioCargoId }, { select: ['id', field] });
    return <UsuarioCargoDbEntity[K]>usuarioCargo[field];
  }

  async getUsuarioCargoCargo(actorContext: ActorContext, usuarioCargoId: number) {
    const usuarioCargo = await this.findUsuarioCargoByIdStrictSimple(actorContext, usuarioCargoId);

    const cargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      const qb = cargoRepository
        .createQueryBuilder('cargo')
        .select(['cargo.id'])
        .innerJoin('cargo.usuarioCargo', 'usuario_cargo')
        .where('usuario_cargo.id = :usuarioCargoId', { usuarioCargoId: usuarioCargo.id });

      const cargo = await qb.getOneOrFail();

      return cargo;
    });

    return cargo;
  }

  async getUsuarioCargoUsuario(actorContext: ActorContext, usuarioCargoId: number) {
    const usuarioCargo = await this.findUsuarioCargoByIdStrictSimple(actorContext, usuarioCargoId);

    const usuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      const qb = usuarioRepository
        .createQueryBuilder('usuario')
        .select(['usuario.id'])
        .innerJoin('usuario.usuarioCargo', 'usuario_cargo')
        .where('usuario_cargo.id = :usuarioCargoId', { usuarioCargoId: usuarioCargo.id });

      const usuario = await qb.getOneOrFail();

      return usuario;
    });

    return usuario;
  }

  async addCargoToUsuario(actorContext: ActorContext, dto: IAddCargoToUsuarioInput) {
    const cargo = await this.cargoService.findCargoByIdStrictSimple(actorContext, dto.cargoId);
    const usuario = await this.usuarioService.findUsuarioByIdStrictSimple(actorContext, dto.usuarioId);

    const usuarioCargoExists = await this.findUsuarioCargoByUsuarioIdAndCargoId(actorContext, {
      cargoId: cargo.id,
      usuarioId: usuario.id,
    });

    if (usuarioCargoExists) {
      return usuarioCargoExists;
    }

    const usuarioCargo = <UsuarioCargoDbEntity>{
      cargo: {
        id: cargo.id,
      },
      usuario: {
        id: usuario.id,
      },
    };

    await actorContext.ensurePermission(APP_RESOURCE_USUARIO_CARGO, ContextAction.CREATE, usuarioCargo);

    const dbUsuarioCargo = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioCargoRepository = getUsuarioCargoRepository(entityManager);
      await usuarioCargoRepository.save(usuarioCargo);
      return <UsuarioCargoDbEntity>usuarioCargo;
    });

    return this.findUsuarioCargoByIdStrictSimple(actorContext, dbUsuarioCargo.id);
  }

  async removeCargoFromUsuario(actorContext: ActorContext, dto: IRemoveCargoFromUsuarioInput) {
    const cargo = await this.cargoService.findCargoByIdStrictSimple(actorContext, dto.cargoId);
    const usuario = await this.usuarioService.findUsuarioByIdStrictSimple(actorContext, dto.usuarioId);

    const usuarioCargoAlreadyExists = await this.findUsuarioCargoByUsuarioIdAndCargoId(actorContext, {
      cargoId: cargo.id,
      usuarioId: usuario.id,
    });

    if (usuarioCargoAlreadyExists) {
      await actorContext.ensurePermission(APP_RESOURCE_USUARIO_CARGO, ContextAction.DELETE, usuarioCargoAlreadyExists);

      await actorContext.databaseRun(async ({ entityManager }) => {
        const usuarioCargoRepository = getUsuarioCargoRepository(entityManager);
        await usuarioCargoRepository.delete(usuarioCargoAlreadyExists.id);
      });
    }

    return true;
  }
}
