import { Injectable, NotFoundException } from '@nestjs/common';
import { intersection, omit, pick } from 'lodash';
import { ActorContext } from 'src/actor-context/ActorContext';
import { APP_RESOURCE_PERMISSAO, APP_RESOURCE_USUARIO } from 'src/actor-context/providers';
import { ContextAction } from 'src/authorization/interfaces';
import { getCargoRepository } from 'src/database/repositories/cargo.repository';
import { getUsuarioRepository } from 'src/database/repositories/usuario.repository';
import { getUsuarioCargoRepository } from 'src/database/repositories/usuario_cargo.repository';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { UsuarioDbEntity } from '../../../database/entities/usuario.db.entity';
import { ICreateUsuarioInput, IDeleteUsuarioInput, IFindUsuarioByIdInput, IUpdateUsuarioInput, ListUsuarioResultType } from './dtos';
import { UsuarioType } from './usuario.type';
import { getPermissaoRepository } from '../../../database/repositories/permissao.repository';
import { pickIds } from '../../../common/pickIds';
import { PermissaoDbEntity } from '../../../database/entities/permissao.db.entity';

@Injectable()
export class UsuarioService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findUsuarioById(actorContext: ActorContext, dto: IFindUsuarioByIdInput, options?: FindOneOptions<UsuarioDbEntity>) {
    const targetUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return usuarioRepository.findOne({
        where: { id: dto.id },
        select: ['id'],
        cache: 20,
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

  async findUsuarioByIdStrictSimple<T = Pick<UsuarioDbEntity, 'id'>>(actorContext: ActorContext, usuarioId: number): Promise<T> {
    const usuario = await this.findUsuarioByIdStrict(actorContext, { id: usuarioId });
    return <T>usuario;
  }

  async findUsuarioByKeycloakId(actorContext: ActorContext, keycloakId: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const targetUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return await usuarioRepository.findOne({
        where: { keycloakId: keycloakId },
        select: ['id'],
      });
    });

    if (!targetUsuario) {
      return null;
    }

    return this.findUsuarioById(actorContext, { id: targetUsuario.id }, options);
  }

  async findUsuarioByKeycloakIdStrict(actorContext: ActorContext, keycloakId: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const usuario = await this.findUsuarioByKeycloakId(actorContext, keycloakId, options);

    if (!usuario) {
      throw new NotFoundException();
    }

    return usuario;
  }

  async listUsuario(actorContext: ActorContext, dto: IGenericListInput): Promise<ListUsuarioResultType> {
    const allowedIds = await actorContext.getAllowedResourcesIdsForResourceAction(APP_RESOURCE_USUARIO, ContextAction.READ);

    const result = await this.meilisearchService.listResource<UsuarioType>(APP_RESOURCE_USUARIO, dto, allowedIds);

    return {
      ...result,
    };
  }

  async getUsuarioStrictGenericField<K extends keyof UsuarioDbEntity>(
    actorContext: ActorContext,
    usuarioId: number,
    field: K,
  ): Promise<UsuarioDbEntity[K]> {
    const usuario = await this.findUsuarioByIdStrict(actorContext, { id: usuarioId }, { select: ['id', field] });
    return <UsuarioDbEntity[K]>usuario[field];
  }

  // ...

  async getUsuarioEmail(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'email');
  }

  async getUsuarioMatriculaSiape(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'matriculaSiape');
  }

  //

  async getUsuarioKeycloakId(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'keycloakId');
  }

  //

  async getUsuarioCreatedAt(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'createdAt');
  }

  async getUsuarioUpdatedAt(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'updatedAt');
  }

  async getUsuarioDeletedAt(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'deletedAt');
  }

  async getUsuarioSearchSyncAt(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'searchSyncAt');
  }

  //

  async getUsuarioPermissoes(actorContext: ActorContext, usuarioId: number) {
    const usuario = await this.findUsuarioByIdStrictSimple(actorContext, usuarioId);

    const allowedIds = await actorContext.getAllowedResourcesIdsForResourceAction(APP_RESOURCE_PERMISSAO, ContextAction.READ);

    const usuarioPermissoesIds = await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      const qb = await permissaoRepository.createQueryBuilderForUser(usuario.id);

      qb.select(['permissao.id']);

      const permissoes = await qb.getMany();

      const ids = pickIds(permissoes);

      return ids;
    });

    const targetPermissoesIds = intersection(allowedIds, usuarioPermissoesIds);

    const permissoes = targetPermissoesIds.map((id) => <PermissaoDbEntity>{ id: id });

    return permissoes;
  }

  // ...

  async loadUsuarioFromKeycloakId(actorContext: ActorContext, keycloakId: string) {
    const usuarioExists = await this.findUsuarioByKeycloakId(actorContext, keycloakId);

    if (usuarioExists) {
      return this.findUsuarioByIdStrictSimple(actorContext, usuarioExists.id);
    }

    const newUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
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

    return this.findUsuarioByIdStrictSimple(actorContext, newUsuario.id);
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

      await usuarioRepository
        .createQueryBuilder('usuario')
        .update()
        .set({
          deletedAt: new Date(),
        })
        .where('id = :id', { id: usuario.id });
    });
  }
}
