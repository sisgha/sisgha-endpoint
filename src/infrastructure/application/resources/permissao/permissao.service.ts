import { Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { FindOneOptions } from 'typeorm';
import { ContextAction } from '../../../../domain/authorization-constraints';
import { ICreatePermissaoInput, IDeletePermissaoInput, IFindPermissaoByIdInput } from '../../../../domain/dtos';
import { IUpdatePermissaoInput } from '../../../../domain/dtos/IUpdatePermissaoInput';
import { IGenericListInput } from '../../../../domain/search/IGenericListInput';
import { ActorContext } from '../../../actor-context/ActorContext';
import { PermissaoDbEntity } from '../../../database/entities/permissao.db.entity';
import { getPermissaoRepository } from '../../../database/repositories/permissao.repository';
import { MeiliSearchService } from '../../../meilisearch/meilisearch.service';
import { ListPermissaoResultType, PermissaoType } from '../../dtos';
import { APP_RESOURCE_PERMISSAO } from './permissao.resource';

@Injectable()
export class PermissaoService {
  constructor(
    // ...
    private meilisearchService: MeiliSearchService,
  ) {}

  async findPermissaoById(
    actorContext: ActorContext,
    dto: IFindPermissaoByIdInput,
    options: FindOneOptions<PermissaoDbEntity> | null = null,
  ) {
    const targetPermissao = await actorContext.databaseRun(({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      return permissaoRepository.findOne({
        where: { id: dto.id },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetPermissao) {
      return null;
    }

    const permissao = await actorContext.databaseRun(({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      return permissaoRepository.findOneOrFail({
        where: { id: targetPermissao.id },
        select: ['id'],
        ...options,
      });
    });

    return actorContext.readResource(APP_RESOURCE_PERMISSAO, permissao);
  }

  async findPermissaoByIdStrict(
    actorContext: ActorContext,
    dto: IFindPermissaoByIdInput,
    options: FindOneOptions<PermissaoDbEntity> | null = null,
  ) {
    const permissao = await this.findPermissaoById(actorContext, dto, options);

    if (!permissao) {
      throw new NotFoundException();
    }

    return permissao;
  }

  async findPermissaoByIdStrictSimple<T = Pick<PermissaoDbEntity, 'id'>>(actorContext: ActorContext, permissaoId: number): Promise<T> {
    const permissao = await this.findPermissaoByIdStrict(actorContext, { id: permissaoId });
    return <T>permissao;
  }

  async listPermissao(actorContext: ActorContext, dto: IGenericListInput): Promise<ListPermissaoResultType> {
    const allowedIds = await actorContext.getAllowedIdsForResourceAction(APP_RESOURCE_PERMISSAO, ContextAction.READ);

    const result = await this.meilisearchService.listResource<PermissaoType>(APP_RESOURCE_PERMISSAO, dto, allowedIds);

    return {
      ...result,
    };
  }

  async getPermissaoStrictGenericField<K extends keyof PermissaoDbEntity>(
    actorContext: ActorContext,
    permissaoId: number,
    field: K,
  ): Promise<PermissaoDbEntity[K]> {
    const permissao = await this.findPermissaoByIdStrict(actorContext, { id: permissaoId }, { select: ['id', field] });
    return <PermissaoDbEntity[K]>permissao[field];
  }

  async getPermissaoDescricao(actorContext: ActorContext, permissaoId: number) {
    return this.getPermissaoStrictGenericField(actorContext, permissaoId, 'descricao');
  }

  async getPermissaoAcao(actorContext: ActorContext, permissaoId: number) {
    return this.getPermissaoStrictGenericField(actorContext, permissaoId, 'acao');
  }

  async getPermissaoRecurso(actorContext: ActorContext, permissaoId: number) {
    return this.getPermissaoStrictGenericField(actorContext, permissaoId, 'recurso');
  }

  async getPermissaoConstraint(actorContext: ActorContext, permissaoId: number) {
    return this.getPermissaoStrictGenericField(actorContext, permissaoId, 'constraint');
  }

  async getPermissaoDateCreated(actorContext: ActorContext, permissaoId: number) {
    return this.getPermissaoStrictGenericField(actorContext, permissaoId, 'dateCreated');
  }

  async getPermissaoDateUpdated(actorContext: ActorContext, permissaoId: number) {
    return this.getPermissaoStrictGenericField(actorContext, permissaoId, 'dateUpdated');
  }

  async getPermissaoDateDeleted(actorContext: ActorContext, permissaoId: number) {
    return this.getPermissaoStrictGenericField(actorContext, permissaoId, 'dateDeleted');
  }

  async getPermissaoDateSearchSync(actorContext: ActorContext, permissaoId: number) {
    return this.getPermissaoStrictGenericField(actorContext, permissaoId, 'dateSearchSync');
  }

  async createPermissao(actorContext: ActorContext, dto: ICreatePermissaoInput) {
    const fieldsData = omit(dto, ['constraint']);

    const permissao = <PermissaoDbEntity>{
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_PERMISSAO, ContextAction.CREATE, permissao);

    const dbPermissao = await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);
      await permissaoRepository.save(permissao);
      return <PermissaoDbEntity>permissao;
    });

    return this.findPermissaoByIdStrictSimple(actorContext, dbPermissao.id);
  }

  async updatePermissao(actorContext: ActorContext, dto: IUpdatePermissaoInput) {
    const permissao = await this.findPermissaoByIdStrictSimple(actorContext, dto.id);

    const fieldsData = omit(dto, ['id', 'constraint']);

    const updatedPermissao = <PermissaoDbEntity>{
      ...permissao,
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_PERMISSAO, ContextAction.UPDATE, updatedPermissao);

    await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);
      await permissaoRepository.save(updatedPermissao);
      return <PermissaoDbEntity>updatedPermissao;
    });

    return this.findPermissaoByIdStrictSimple(actorContext, permissao.id);
  }

  async deletePermissao(actorContext: ActorContext, dto: IDeletePermissaoInput) {
    const permissao = await this.findPermissaoByIdStrictSimple(actorContext, dto.id);

    await actorContext.ensurePermission(APP_RESOURCE_PERMISSAO, ContextAction.DELETE, permissao);

    await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      await permissaoRepository
        .createQueryBuilder('permissao')
        .update()
        .set({
          dateDeleted: new Date(),
        })
        .where('id = :id', { id: permissao.id })
        .execute();
    });

    return true;
  }
}
