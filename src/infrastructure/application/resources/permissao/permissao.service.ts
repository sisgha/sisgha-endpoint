import { Injectable, NotFoundException } from '@nestjs/common';
import { isEmpty, omit } from 'lodash';
import { FindOneOptions } from 'typeorm';
import { ContextAction } from '../../../../domain/authorization-constraints';
import { ICreatePermissaoInput, IDeletePermissaoInput, IFindPermissaoByIdInput } from '../../../../domain/dtos';
import { IUpdatePermissaoInput } from '../../../../domain/dtos/IUpdatePermissaoInput';
import { IGenericListInput } from '../../../../domain/search/IGenericListInput';
import { ActorContext } from '../../../actor-context/ActorContext';
import { PermissaoDbEntity } from '../../../database/entities/permissao.db.entity';
import { PermissaoRecursoDbEntity } from '../../../database/entities/permissao_recurso.db.entity';
import { PermissaoVerboDbEntity } from '../../../database/entities/permissao_verbo.db.entity';
import { getPermissaoRepository } from '../../../database/repositories/permissao.repository';
import { getPermissaoRecursoRepository } from '../../../database/repositories/permissao_recurso.repository';
import { getPermissaoVerboRepository } from '../../../database/repositories/permissao_verbo.repository';
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
    const allowedIds = await actorContext.getAllowedIdsByRecursoVerbo(APP_RESOURCE_PERMISSAO, ContextAction.READ);

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

  async getPermissaoVerboGlobal(actorContext: ActorContext, permissaoId: number) {
    return this.getPermissaoStrictGenericField(actorContext, permissaoId, 'verboGlobal');
  }

  async getPermissaoVerbos(actorContext: ActorContext, permissaoId: number) {
    const permissao = await this.findPermissaoByIdStrictSimple(actorContext, permissaoId);

    const verbos = await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoVerboRepository = getPermissaoVerboRepository(entityManager);

      const qb = permissaoVerboRepository.createQueryBuilderByPermissaoId(permissao.id);

      qb.select('permissao_verbo.verbo');

      const permissaoVerboList = await qb.getMany();

      return permissaoVerboList.map((permissaoVerbo) => permissaoVerbo.verbo);
    });

    return verbos;
  }

  async getPermissaoRecursoGlobal(actorContext: ActorContext, permissaoId: number) {
    return this.getPermissaoStrictGenericField(actorContext, permissaoId, 'recursoGlobal');
  }

  async getPermissaoRecursos(actorContext: ActorContext, permissaoId: number) {
    const permissao = await this.findPermissaoByIdStrictSimple(actorContext, permissaoId);

    const recursos = await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRecursoRepository = getPermissaoRecursoRepository(entityManager);

      const qb = permissaoRecursoRepository.createQueryBuilderByPermissaoId(permissao.id);

      qb.select('permissao_recurso.recurso');

      const permissaoRecursoList = await qb.getMany();

      return permissaoRecursoList.map((permissaoRecurso) => permissaoRecurso.recurso);
    });

    return recursos;
  }

  async getPermissaoAuthorizationConstraintRecipe(actorContext: ActorContext, permissaoId: number) {
    return this.getPermissaoStrictGenericField(actorContext, permissaoId, 'authorizationConstraintRecipe');
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

  async setPermissaoVerbos(actorContext: ActorContext, permissaoId: number, verboGlobal: boolean, verbos: string[]) {
    const permissao = await this.findPermissaoByIdStrictSimple(actorContext, permissaoId);

    await actorContext.ensurePermission(APP_RESOURCE_PERMISSAO, ContextAction.UPDATE, { id: permissao.id });

    await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoVerboRepository = getPermissaoVerboRepository(entityManager);
      await permissaoVerboRepository.deleteByPermissaoId(permissao.id);
    });

    if (!verboGlobal) {
      await actorContext.databaseRun(async ({ entityManager }) => {
        const permissaoVerboRepository = getPermissaoVerboRepository(entityManager);

        const permissaoVerboList = verbos.map((verbo) => {
          return <PermissaoVerboDbEntity>{
            permissao,
            verbo,
          };
        });

        await permissaoVerboRepository.save(permissaoVerboList);
      });
    }
  }

  async setPermissaoRecursos(actorContext: ActorContext, permissaoId: number, recursoGlobal: boolean, recursos: string[]) {
    const permissao = await this.findPermissaoByIdStrictSimple(actorContext, permissaoId);

    await actorContext.ensurePermission(APP_RESOURCE_PERMISSAO, ContextAction.UPDATE, { id: permissao.id });

    await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRecursoRepository = getPermissaoRecursoRepository(entityManager);
      await permissaoRecursoRepository.deleteByPermissaoId(permissao.id);
    });

    if (!recursoGlobal) {
      await actorContext.databaseRun(async ({ entityManager }) => {
        const permissaoRecursoRepository = getPermissaoRecursoRepository(entityManager);

        const permissaoRecursoList = recursos.map((recurso) => {
          return <PermissaoRecursoDbEntity>{
            permissao,
            recurso,
          };
        });

        await permissaoRecursoRepository.save(permissaoRecursoList);
      });
    }
  }

  async createPermissao(actorContext: ActorContext, dto: ICreatePermissaoInput) {
    const fieldsData = omit(dto, ['verbos', 'recursos']);

    const permissao = <PermissaoDbEntity>{
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_PERMISSAO, ContextAction.CREATE, permissao);

    const dbPermissao = await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);
      await permissaoRepository.save(permissao);
      return <PermissaoDbEntity>permissao;
    });

    await this.setPermissaoVerbos(actorContext, dbPermissao.id, permissao.verboGlobal, dto.verbos);
    await this.setPermissaoRecursos(actorContext, dbPermissao.id, permissao.recursoGlobal, dto.recursos);

    return this.findPermissaoByIdStrictSimple(actorContext, dbPermissao.id);
  }

  async updatePermissao(actorContext: ActorContext, dto: IUpdatePermissaoInput) {
    const permissao = await this.findPermissaoByIdStrictSimple(actorContext, dto.id);

    const fieldsData = omit(dto, ['id', 'verbos', 'recursos']);

    const updatedPermissao = <PermissaoDbEntity>{
      ...permissao,
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_PERMISSAO, ContextAction.UPDATE, updatedPermissao);

    const verboGlobal = dto.verboGlobal ?? (await this.getPermissaoVerboGlobal(actorContext, permissao.id));
    const verbos = dto.verbos ?? (await this.getPermissaoVerbos(actorContext, permissao.id));
    await this.setPermissaoVerbos(actorContext, permissao.id, verboGlobal, verbos);

    const recursoGlobal = dto.recursoGlobal ?? (await this.getPermissaoRecursoGlobal(actorContext, permissao.id));
    const recursos = dto.recursos ?? (await this.getPermissaoRecursos(actorContext, permissao.id));
    await this.setPermissaoRecursos(actorContext, permissao.id, recursoGlobal, recursos);

    if (!isEmpty(fieldsData)) {
      await actorContext.databaseRun(async ({ entityManager }) => {
        const permissaoRepository = getPermissaoRepository(entityManager);
        await permissaoRepository.save(updatedPermissao);
        return <PermissaoDbEntity>updatedPermissao;
      });
    }

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
