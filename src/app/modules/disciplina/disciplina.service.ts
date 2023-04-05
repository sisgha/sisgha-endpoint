import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { has, isNil, omit } from 'lodash';
import MeiliSearch from 'meilisearch';
import { AppContext } from 'src/app-context/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { DisciplinaDbEntity } from 'src/database/entities/disciplina.db.entity';
import { LugarDbEntity } from 'src/database/entities/lugar.db.entity';
import { getDisciplinaRepository } from 'src/database/repositories/disciplina.repository';
import { getLugarRepository } from 'src/database/repositories/lugar.repository';
import { INDEX_DISCIPLINA } from 'src/meilisearch/constants/meilisearch-tokens';
import { MEILISEARCH_CLIENT } from 'src/meilisearch/constants/MEILISEARCH_CLIENT.const';
import { FindOneOptions } from 'typeorm';
import { LugarService } from '../lugar/lugar.service';
import { DisciplinaType } from './disciplina.type';
import {
  ICreateDisciplinaInput,
  IDeleteDisciplinaInput,
  IFindDisciplinaByIdInput,
  IListDisciplinaInput,
  IUpdateDisciplinaInput,
  ListDisciplinaResultType,
} from './dtos';

@Injectable()
export class DisciplinaService {
  constructor(
    private lugarService: LugarService,

    @Inject(MEILISEARCH_CLIENT)
    private meilisearchClient: MeiliSearch,
  ) {}

  async findDisciplinaById(
    appContext: AppContext,
    dto: IFindDisciplinaByIdInput,
    options?: FindOneOptions<DisciplinaDbEntity>,
  ) {
    const { id } = dto;

    const targetDisciplina = await appContext.databaseRun(
      async ({ entityManager }) => {
        const disciplinaRepository = getDisciplinaRepository(entityManager);

        return disciplinaRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetDisciplina) {
      return null;
    }

    const disciplina = await appContext.databaseRun<DisciplinaDbEntity>(
      async ({ entityManager }) => {
        const disciplinaRepository = getDisciplinaRepository(entityManager);

        return await disciplinaRepository.findOneOrFail({
          where: { id: targetDisciplina.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return disciplina;
  }

  async findDisciplinaByIdStrict(
    appContext: AppContext,
    dto: IFindDisciplinaByIdInput,
    options?: FindOneOptions<DisciplinaDbEntity>,
  ) {
    const disciplina = await this.findDisciplinaById(appContext, dto, options);

    if (!disciplina) {
      throw new NotFoundException();
    }

    return disciplina;
  }

  async findDisciplinaByIdStrictSimple(
    appContext: AppContext,
    disciplinaId: number,
  ): Promise<Pick<DisciplinaDbEntity, 'id'>> {
    const disciplina = await this.findDisciplinaByIdStrict(appContext, {
      id: disciplinaId,
    });

    return disciplina as Pick<DisciplinaDbEntity, 'id'>;
  }

  async listDisciplina(
    appContext: AppContext,
    dto: IListDisciplinaInput,
  ): Promise<ListDisciplinaResultType> {
    const { query, limit, offset } = dto;

    const meilisearchResult = await this.meilisearchClient
      .index(INDEX_DISCIPLINA)
      .search<DisciplinaType>(query, { limit, offset });

    const items = await parralelMap(meilisearchResult.hits, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const curso = await this.findDisciplinaById(appContext, {
          id: hit.id,
        });

        if (curso) {
          return curso;
        }
      }

      return null;
    });

    const result: ListDisciplinaResultType = {
      query: meilisearchResult.query,

      limit: meilisearchResult.limit,
      offset: meilisearchResult.offset,

      total: meilisearchResult.estimatedTotalHits,

      items: items,
    };

    return result;
  }

  async getDisciplinaGenericField<K extends keyof DisciplinaDbEntity>(
    appContext: AppContext,
    disciplinaId: number,
    field: K,
  ): Promise<DisciplinaDbEntity[K]> {
    const disciplina = await this.findDisciplinaByIdStrict(
      appContext,
      { id: disciplinaId },
      { select: ['id', field] },
    );

    return <DisciplinaDbEntity[K]>disciplina[field];
  }

  /*
  async getDisciplinaGenericField(appContext: app-context, disciplinaId: number) {
    return this.getDisciplinaGenericField(appContext, disciplinaId, 'genericField');
  }
  */

  async getDisciplinaNome(appContext: AppContext, disciplinaId: number) {
    return this.getDisciplinaGenericField(appContext, disciplinaId, 'nome');
  }

  async getDisciplinaLugarPadrao(appContext: AppContext, disciplinaId: number) {
    const disciplina = await this.findDisciplinaByIdStrictSimple(
      appContext,
      disciplinaId,
    );

    const lugarPadrao = await appContext.databaseRun(
      async ({ entityManager }) => {
        const lugarRepository = getLugarRepository(entityManager);

        return lugarRepository
          .createQueryBuilder('lugar')
          .innerJoin('lugar.disciplinas', 'disciplina')
          .where('disciplina.id = :disciplinaId', {
            disciplinaId: disciplina.id,
          })
          .select(['lugar.id'])
          .getOne();
      },
    );

    return lugarPadrao;
  }

  async createDisciplina(appContext: AppContext, dto: ICreateDisciplinaInput) {
    const fieldsData = omit(dto, ['lugarPadraoId']);

    const disciplina = <DisciplinaDbEntity>{ ...fieldsData };

    if (has(dto, 'lugarPadraoId')) {
      const lugarPadraoId = <number | null>dto.lugarPadraoId;

      const lugarPadrao = lugarPadraoId
        ? await this.lugarService.findLugarByIdStrictSimple(
            appContext,
            lugarPadraoId,
          )
        : null;

      disciplina.lugarPadrao = <LugarDbEntity>lugarPadrao;
    }

    await appContext.databaseRun(async ({ entityManager }) => {
      const disciplinaRepository = getDisciplinaRepository(entityManager);
      await disciplinaRepository.save(disciplina);
      return disciplina;
    });

    return this.findDisciplinaByIdStrictSimple(appContext, disciplina.id);
  }

  async updateDisciplina(appContext: AppContext, dto: IUpdateDisciplinaInput) {
    const { id } = dto;

    const disciplina = await this.findDisciplinaByIdStrictSimple(
      appContext,
      id,
    );

    const fieldsData = omit(dto, ['id', 'lugarPadraoId']);

    const updatedDisciplina = <DisciplinaDbEntity>{
      ...disciplina,
      ...fieldsData,
    };

    if (has(dto, 'lugarPadraoId')) {
      const lugarPadraoId = <number | null>dto.lugarPadraoId;

      const lugarPadrao = lugarPadraoId
        ? await this.lugarService.findLugarByIdStrictSimple(
            appContext,
            lugarPadraoId,
          )
        : null;

      updatedDisciplina.lugarPadrao = <LugarDbEntity>lugarPadrao;
    }

    await appContext.databaseRun(async ({ entityManager }) => {
      const disciplinaRepository = getDisciplinaRepository(entityManager);

      await disciplinaRepository.updateDisciplina(
        updatedDisciplina,
        disciplina.id,
      );

      return updatedDisciplina;
    });

    return this.findDisciplinaByIdStrictSimple(appContext, disciplina.id);
  }

  async deleteDisciplina(appContext: AppContext, dto: IDeleteDisciplinaInput) {
    const disciplina = await this.findDisciplinaByIdStrictSimple(
      appContext,
      dto.id,
    );

    return appContext.databaseRun(async ({ entityManager }) => {
      const disciplinaRepository = getDisciplinaRepository(entityManager);

      try {
        await disciplinaRepository.delete(disciplina.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
