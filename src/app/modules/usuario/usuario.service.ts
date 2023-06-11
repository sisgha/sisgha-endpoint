import { Injectable, NotFoundException } from '@nestjs/common';
import { omit, pick } from 'lodash';
import { ActorContext } from 'src/actor-context/ActorContext';
import { APP_RESOURCE_CARGO, APP_RESOURCE_USUARIO } from 'src/actor-context/providers';
import { ContextAction } from 'src/authorization/interfaces';
import { getCargoRepository } from 'src/database/repositories/cargo.repository';
import { getUsuarioRepository } from 'src/database/repositories/usuario.repository';
import { getUsuarioCargoRepository } from 'src/database/repositories/usuario_cargo.repository';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { UsuarioDbEntity } from '../../../database/entities/usuario.db.entity';
import { ICreateUsuarioInput, IDeleteUsuarioInput, IFindUsuarioByIdInput, IUpdateUsuarioInput } from './dtos';
import { ListUsuarioResultType } from './dtos/ListUsuarioResult';
import { UsuarioType } from './usuario.type';

@Injectable()
export class UsuarioService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findUsuarioById(actorContext: ActorContext, dto: IFindUsuarioByIdInput, options?: FindOneOptions<UsuarioDbEntity>) {
    const { id } = dto;

    const targetUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return usuarioRepository.findOne({
        where: { id },
        select: ['id'],
      });
    });

    if (!targetUsuario) {
      return null;
    }

    const usuario = await actorContext.databaseRun<UsuarioDbEntity>(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return await usuarioRepository.findOneOrFail({
        where: { id: targetUsuario.id },
        select: ['id'],
        ...options,
      });
    });

    return actorContext.readResource(APP_RESOURCE_USUARIO, usuario);
  }

  async findUsuarioByIdStrict(actorContext: ActorContext, dto: IFindUsuarioByIdInput, options?: FindOneOptions<UsuarioDbEntity>) {
    const usuario = await this.findUsuarioById(actorContext, dto, options);

    if (!usuario) {
      throw new NotFoundException();
    }

    return usuario;
  }

  async findUsuarioByIdStrictSimple(actorContext: ActorContext, usuarioId: number): Promise<Pick<UsuarioDbEntity, 'id'>> {
    const usuario = await this.findUsuarioByIdStrict(actorContext, {
      id: usuarioId,
    });

    return usuario as Pick<UsuarioDbEntity, 'id'>;
  }

  async listUsuario(actorContext: ActorContext, dto: IGenericListInput): Promise<ListUsuarioResultType> {
    const allowedIds = await actorContext.getAllowedResourcesIdsForResourceAction(APP_RESOURCE_USUARIO, ContextAction.READ);

    const result = await this.meilisearchService.listResource<UsuarioType>(APP_RESOURCE_USUARIO, dto, allowedIds);

    return {
      ...result,
    };
  }

  async getUsuarioFromKeycloakId(actorContext: ActorContext, keycloakId: string) {
    const userExists = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return await usuarioRepository.findOne({
        where: { keycloakId: keycloakId },
        select: ['id'],
      });
    });

    if (userExists) {
      return this.findUsuarioByIdStrictSimple(actorContext, userExists.id);
    }

    const newUser = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);
      const usuarioRepository = getUsuarioRepository(entityManager);
      const usuarioCargoRepository = getUsuarioCargoRepository(entityManager);

      const newUser = usuarioRepository.create();
      newUser.keycloakId = keycloakId;

      const usersCount = await usuarioRepository.count();
      const hasUsers = usersCount > 0;

      await usuarioRepository.save(newUser);

      if (!hasUsers) {
        const cargoDape = await cargoRepository.findOne({
          where: { slug: 'dape' },
        });

        if (cargoDape) {
          const usuarioHasCargo = usuarioCargoRepository.create();
          usuarioHasCargo.usuario = newUser;
          usuarioHasCargo.cargo = cargoDape;
          await usuarioCargoRepository.save(usuarioHasCargo);
        }
      }

      return await usuarioRepository.findOneOrFail({
        where: { keycloakId: keycloakId },
        select: ['id'],
      });
    });

    return this.findUsuarioByIdStrictSimple(actorContext, newUser.id);
  }

  async getUsuarioStrictGenericField<K extends keyof UsuarioDbEntity>(
    actorContext: ActorContext,
    usuarioId: number,
    field: K,
  ): Promise<UsuarioDbEntity[K]> {
    const usuario = await this.findUsuarioByIdStrict(actorContext, { id: usuarioId }, { select: ['id', field] });

    return <UsuarioDbEntity[K]>usuario[field];
  }

  async getUsuarioEmail(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'email');
  }

  async getUsuarioKeycloakId(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'keycloakId');
  }

  async getUsuarioMatriculaSiape(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'matriculaSiape');
  }

  async getUsuarioCargos(actorContext: ActorContext, usuarioId: number) {
    const usuario = await this.findUsuarioByIdStrictSimple(actorContext, usuarioId);

    const allowedCargoIds = await actorContext.getAllowedResourcesForResourceAction(APP_RESOURCE_CARGO, ContextAction.READ);

    const cargos = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      return cargoRepository
        .createQueryBuilder('cargo')
        .innerJoin('cargo.usuarioCargo', 'usuarioCargo')
        .innerJoin('usuarioCargo.usuario', 'usuario')
        .where('usuario.id = :usuarioId', { usuarioId: usuario.id })
        .andWhere('cargo.id IN (:...allowedCargoIds)', {
          allowedCargoIds: allowedCargoIds,
        })
        .select(['cargo.id'])
        .getMany();
    });

    return cargos;
  }

  async createUsuario(actorContext: ActorContext, dto: ICreateUsuarioInput) {
    const fieldsData = pick(dto, ['email']);

    const usuario = <UsuarioDbEntity>{
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_USUARIO, ContextAction.CREATE, usuario);

    const dbUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);
      await usuarioRepository.save(usuario);
      return <UsuarioDbEntity>usuario;
    });

    return this.findUsuarioByIdStrictSimple(actorContext, dbUsuario.id);
  }

  async updateUsuario(actorContext: ActorContext, dto: IUpdateUsuarioInput) {
    const usuario = await this.findUsuarioByIdStrictSimple(actorContext, dto.id);

    const fieldsData = omit(dto, ['id']);

    const updatedUsuario = <UsuarioDbEntity>{
      ...usuario,
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_USUARIO, ContextAction.UPDATE, updatedUsuario);

    await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);
      await usuarioRepository.save(updatedUsuario);
      return <UsuarioDbEntity>updatedUsuario;
    });

    return this.findUsuarioByIdStrictSimple(actorContext, usuario.id);
  }

  async deleteUsuario(actorContext: ActorContext, dto: IDeleteUsuarioInput) {
    const usuario = await this.findUsuarioByIdStrictSimple(actorContext, dto.id);

    await actorContext.ensurePermission(APP_RESOURCE_USUARIO, ContextAction.DELETE, usuario);

    return actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      try {
        await usuarioRepository.delete(usuario.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
