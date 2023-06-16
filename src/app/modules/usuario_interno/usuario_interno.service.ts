import { Injectable, NotFoundException } from '@nestjs/common';
import { intersection, omit, pick } from 'lodash';
import { ActorContext } from 'src/actor-context/ActorContext';
import { APP_RESOURCE_PERMISSAO, APP_RESOURCE_USUARIO_INTERNO } from 'src/actor-context/providers';
import { ContextAction } from 'src/authorization/interfaces';
import { UsuarioInternoDbEntity } from 'src/database/entities/usuario_interno.db.entity';
import { getUsuarioInternoRepository } from 'src/database/repositories/usuario_interno.repository';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { extractIds } from '../../../common/extract-ids';
import { PermissaoDbEntity } from '../../../database/entities/permissao.db.entity';
import { getPermissaoRepository } from '../../../database/repositories/permissao.repository';
import {
  ICreateUsuarioInternoInput,
  IDeleteUsuarioInternoInput,
  IFindUsuarioInternoByIdInput,
  IUpdateUsuarioInternoInput,
  ListUsuarioInternoResultType,
} from './dtos';
import { UsuarioInternoType } from './usuario_interno.type';

@Injectable()
export class UsuarioInternoService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findUsuarioInternoById(
    actorContext: ActorContext,
    dto: IFindUsuarioInternoByIdInput,
    options?: FindOneOptions<UsuarioInternoDbEntity>,
  ) {
    const targetUsuarioInterno = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioInternoRepository = getUsuarioInternoRepository(entityManager);

      return usuarioInternoRepository.findOne({
        where: { id: dto.id },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetUsuarioInterno) {
      return null;
    }

    const usuarioInterno = await actorContext.databaseRun<UsuarioInternoDbEntity>(async ({ entityManager }) => {
      const usuarioInternoRepository = getUsuarioInternoRepository(entityManager);

      return await usuarioInternoRepository.findOneOrFail({
        where: { id: targetUsuarioInterno.id },
        select: ['id'],
        ...options,
      });
    });

    return actorContext.readResource(APP_RESOURCE_USUARIO_INTERNO, usuarioInterno);
  }

  async findUsuarioInternoByIdStrict(
    actorContext: ActorContext,
    dto: IFindUsuarioInternoByIdInput,
    options?: FindOneOptions<UsuarioInternoDbEntity>,
  ) {
    const usuarioInterno = await this.findUsuarioInternoById(actorContext, dto, options);

    if (!usuarioInterno) {
      throw new NotFoundException();
    }

    return usuarioInterno;
  }

  async findUsuarioInternoByIdStrictSimple<T = Pick<UsuarioInternoDbEntity, 'id'>>(
    actorContext: ActorContext,
    usuarioInternoId: number,
  ): Promise<T> {
    const usuarioInterno = await this.findUsuarioInternoByIdStrict(actorContext, { id: usuarioInternoId });
    return <T>usuarioInterno;
  }

  async listUsuarioInterno(actorContext: ActorContext, dto: IGenericListInput): Promise<ListUsuarioInternoResultType> {
    const allowedUsuarioInternoIds = await actorContext.getAllowedResourcesIdsForResourceAction(
      APP_RESOURCE_USUARIO_INTERNO,
      ContextAction.READ,
    );

    const result = await this.meilisearchService.listResource<UsuarioInternoType>(
      APP_RESOURCE_USUARIO_INTERNO,
      dto,
      allowedUsuarioInternoIds,
    );

    return {
      ...result,
    };
  }

  async getUsuarioInternoStrictGenericField<K extends keyof UsuarioInternoDbEntity>(
    actorContext: ActorContext,
    usuarioInternoId: number,
    field: K,
  ): Promise<UsuarioInternoDbEntity[K]> {
    const usuarioInterno = await this.findUsuarioInternoByIdStrict(actorContext, { id: usuarioInternoId }, { select: ['id', field] });
    return <UsuarioInternoDbEntity[K]>usuarioInterno[field];
  }

  // ...

  async getUsuarioInternoTipoAtor(actorContext: ActorContext, usuarioInternoId: number) {
    return this.getUsuarioInternoStrictGenericField(actorContext, usuarioInternoId, 'tipoAtor');
  }

  //

  async getUsuarioInternoCreatedAt(actorContext: ActorContext, usuarioInternoId: number) {
    return this.getUsuarioInternoStrictGenericField(actorContext, usuarioInternoId, 'createdAt');
  }

  async getUsuarioInternoUpdatedAt(actorContext: ActorContext, usuarioInternoId: number) {
    return this.getUsuarioInternoStrictGenericField(actorContext, usuarioInternoId, 'updatedAt');
  }

  async getUsuarioInternoDeletedAt(actorContext: ActorContext, usuarioInternoId: number) {
    return this.getUsuarioInternoStrictGenericField(actorContext, usuarioInternoId, 'deletedAt');
  }

  async getUsuarioInternoSearchSyncAt(actorContext: ActorContext, usuarioInternoId: number) {
    return this.getUsuarioInternoStrictGenericField(actorContext, usuarioInternoId, 'searchSyncAt');
  }

  //

  async getUsuarioInternoPermissoes(actorContext: ActorContext, usuarioInternoId: number) {
    const usuarioInterno = await this.findUsuarioInternoByIdStrictSimple(actorContext, usuarioInternoId);

    const allowedPermissaoIds = await actorContext.getAllowedResourcesIdsForResourceAction(APP_RESOURCE_PERMISSAO, ContextAction.READ);

    const allUsuarioPermissaoIds = await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      const qb = await permissaoRepository.createQueryBuilderForUsuarioInternoId(usuarioInterno.id);

      qb.select(['permissao.id']);

      const permissoes = await qb.getMany();

      const ids = extractIds(permissoes);

      return ids;
    });

    const targetPermissaoIds = intersection(allowedPermissaoIds, allUsuarioPermissaoIds);

    const permissoes = targetPermissaoIds.map((id) => <PermissaoDbEntity>{ id: id });

    return permissoes;
  }

  // ...

  async createUsuarioInterno(actorContext: ActorContext, dto: ICreateUsuarioInternoInput) {
    const fieldsData = pick(dto, ['tipoAtor']);

    const usuarioInterno = <UsuarioInternoDbEntity>{
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_USUARIO_INTERNO, ContextAction.CREATE, usuarioInterno);

    const dbUsuarioInterno = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioInternoRepository = getUsuarioInternoRepository(entityManager);
      await usuarioInternoRepository.save(usuarioInterno);
      return <UsuarioInternoDbEntity>usuarioInterno;
    });

    return this.findUsuarioInternoByIdStrictSimple(actorContext, dbUsuarioInterno.id);
  }

  async updateUsuarioInterno(actorContext: ActorContext, dto: IUpdateUsuarioInternoInput) {
    const usuarioInterno = await this.findUsuarioInternoByIdStrictSimple(actorContext, dto.id);

    const fieldsData = omit(dto, ['id']);

    const updatedUsuarioInterno = <UsuarioInternoDbEntity>{
      ...usuarioInterno,
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_USUARIO_INTERNO, ContextAction.UPDATE, updatedUsuarioInterno);

    await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioInternoRepository = getUsuarioInternoRepository(entityManager);
      await usuarioInternoRepository.save(updatedUsuarioInterno);
      return <UsuarioInternoDbEntity>updatedUsuarioInterno;
    });

    return this.findUsuarioInternoByIdStrictSimple(actorContext, usuarioInterno.id);
  }

  async deleteUsuarioInterno(actorContext: ActorContext, dto: IDeleteUsuarioInternoInput) {
    const usuarioInterno = await this.findUsuarioInternoByIdStrictSimple(actorContext, dto.id);

    await actorContext.ensurePermission(APP_RESOURCE_USUARIO_INTERNO, ContextAction.DELETE, usuarioInterno);

    return actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioInternoRepository = getUsuarioInternoRepository(entityManager);

      await usuarioInternoRepository
        .createQueryBuilder('usuario_interno')
        .update()
        .set({
          deletedAt: new Date(),
        })
        .where('id = :id', { id: usuarioInterno.id })
        .execute();
    });
  }
}
