import { Injectable, NotFoundException } from '@nestjs/common';
import { intersection, omit, pick } from 'lodash';
import { FindOneOptions } from 'typeorm';
import { ContextAction } from '../../../../domain/authorization-constraints';
import { ICreateUsuarioInternoInput, IDeleteUsuarioInternoInput } from '../../../../domain/dtos';
import { IFindUsuarioInternoByIdInput } from '../../../../domain/dtos/IFindUsuarioInternoByIdInput';
import { IUpdateUsuarioInternoInput } from '../../../../domain/dtos/IUpdateUsuarioInternoInput';
import { IGenericListInput } from '../../../../domain/search/IGenericListInput';
import { ActorContext } from '../../../actor-context/ActorContext';
import { PermissaoDbEntity } from '../../../database/entities/permissao.db.entity';
import { UsuarioInternoDbEntity } from '../../../database/entities/usuario_interno.db.entity';
import { getPermissaoRepository } from '../../../database/repositories/permissao.repository';
import { getUsuarioInternoRepository } from '../../../database/repositories/usuario_interno.repository';
import { extractIds } from '../../../helpers/extract-ids';
import { MeiliSearchService } from '../../../meilisearch/meilisearch.service';
import { ListUsuarioInternoResultType } from '../../dtos/graphql/list_usuario_interno_result.type';
import { UsuarioInternoType } from '../../dtos/graphql/usuario_interno.type';
import { APP_RESOURCE_PERMISSAO } from '../permissao/permissao.resource';
import { APP_RESOURCE_USUARIO_INTERNO } from './usuario_interno.resource';

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
    const allowedUsuarioInternoIds = await actorContext.getAllowedIdsByRecursoVerbo(APP_RESOURCE_USUARIO_INTERNO, ContextAction.READ);

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

  async getUsuarioInternotipoEntidade(actorContext: ActorContext, usuarioInternoId: number) {
    return this.getUsuarioInternoStrictGenericField(actorContext, usuarioInternoId, 'tipoEntidade');
  }

  //

  async getUsuarioInternoDateCreated(actorContext: ActorContext, usuarioInternoId: number) {
    return this.getUsuarioInternoStrictGenericField(actorContext, usuarioInternoId, 'dateCreated');
  }

  async getUsuarioInternoDateUpdated(actorContext: ActorContext, usuarioInternoId: number) {
    return this.getUsuarioInternoStrictGenericField(actorContext, usuarioInternoId, 'dateUpdated');
  }

  async getUsuarioInternoDateDeleted(actorContext: ActorContext, usuarioInternoId: number) {
    return this.getUsuarioInternoStrictGenericField(actorContext, usuarioInternoId, 'dateDeleted');
  }

  async getUsuarioInternoDateSearchSync(actorContext: ActorContext, usuarioInternoId: number) {
    return this.getUsuarioInternoStrictGenericField(actorContext, usuarioInternoId, 'dateSearchSync');
  }

  //

  async getUsuarioInternoPermissoes(actorContext: ActorContext, usuarioInternoId: number) {
    const usuarioInterno = await this.findUsuarioInternoByIdStrictSimple(actorContext, usuarioInternoId);

    const allowedPermissaoIds = await actorContext.getAllowedIdsByRecursoVerbo(APP_RESOURCE_PERMISSAO, ContextAction.READ);

    const allUsuarioPermissaoIds = await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      const qb = await permissaoRepository.initQueryBuilder();

      await permissaoRepository.filterQueryByUsuarioInternoId(qb, usuarioInterno.id);

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
    const fieldsData = pick(dto, ['tipoEntidade']);

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

    await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioInternoRepository = getUsuarioInternoRepository(entityManager);

      await usuarioInternoRepository
        .createQueryBuilder('usuario_interno')
        .update()
        .set({
          dateDeleted: new Date(),
        })
        .where('id = :id', { id: usuarioInterno.id })
        .execute();
    });

    return true;
  }
}
