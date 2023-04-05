import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { AppContext } from 'src/app-context/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { CursoDbEntity } from 'src/database/entities/curso.db.entity';
import { getCursoRepository } from 'src/database/repositories/curso.repository';
import { INDEX_CURSO } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { CursoType } from './curso.type';
import {
  ICreateCursoInput,
  IDeleteCursoInput,
  IFindCursoByIdInput,
  IUpdateCursoInput,
  ListCursoResultType,
} from './dtos';

@Injectable()
export class CursoService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findCursoById(
    appContext: AppContext,
    dto: IFindCursoByIdInput,
    options?: FindOneOptions<CursoDbEntity>,
  ) {
    const { id } = dto;

    const targetCurso = await appContext.databaseRun(
      async ({ entityManager }) => {
        const cursoRepository = getCursoRepository(entityManager);

        return cursoRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetCurso) {
      return null;
    }

    const curso = await appContext.databaseRun<CursoDbEntity>(
      async ({ entityManager }) => {
        const cursoRepository = getCursoRepository(entityManager);

        return await cursoRepository.findOneOrFail({
          where: { id: targetCurso.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return curso;
  }

  async findCursoByIdStrict(
    appContext: AppContext,
    dto: IFindCursoByIdInput,
    options?: FindOneOptions<CursoDbEntity>,
  ) {
    const curso = await this.findCursoById(appContext, dto, options);

    if (!curso) {
      throw new NotFoundException();
    }

    return curso;
  }

  async findCursoByIdStrictSimple(
    appContext: AppContext,
    cursoId: number,
  ): Promise<Pick<CursoDbEntity, 'id'>> {
    const curso = await this.findCursoByIdStrict(appContext, {
      id: cursoId,
    });

    return curso as Pick<CursoDbEntity, 'id'>;
  }

  async listCurso(
    appContext: AppContext,
    dto: IGenericListInput,
  ): Promise<ListCursoResultType> {
    const result = await this.meilisearchService.listResource<CursoType>(
      INDEX_CURSO,
      dto,
    );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findCursoById(appContext, {
          id: hit.id,
        });

        if (row) {
          return row;
        }
      }

      return null;
    });

    return {
      ...result,
      items,
    };
  }

  async getCursoGenericField<K extends keyof CursoDbEntity>(
    appContext: AppContext,
    cursoId: number,
    field: K,
  ): Promise<CursoDbEntity[K]> {
    const curso = await this.findCursoByIdStrict(
      appContext,
      { id: cursoId },
      { select: ['id', field] },
    );

    return <CursoDbEntity[K]>curso[field];
  }

  async getCursoNome(appContext: AppContext, cursoId: number) {
    return this.getCursoGenericField(appContext, cursoId, 'nome');
  }

  async getCursoTipo(appContext: AppContext, cursoId: number) {
    return this.getCursoGenericField(appContext, cursoId, 'tipo');
  }

  async createCurso(appContext: AppContext, dto: ICreateCursoInput) {
    const fieldsData = omit(dto, []);

    const curso = await appContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);

      const curso = <CursoDbEntity>{ ...fieldsData };
      await cursoRepository.save(curso);

      return curso;
    });

    return this.findCursoByIdStrictSimple(appContext, curso.id);
  }

  async updateCurso(appContext: AppContext, dto: IUpdateCursoInput) {
    const { id } = dto;

    const curso = await this.findCursoByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    await appContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);

      const updatedCurso = <CursoDbEntity>{ ...curso, ...fieldsData };

      await cursoRepository.updateCurso(updatedCurso, curso.id);

      return updatedCurso;
    });

    return this.findCursoByIdStrictSimple(appContext, curso.id);
  }

  async deleteCurso(appContext: AppContext, dto: IDeleteCursoInput) {
    const curso = await this.findCursoByIdStrictSimple(appContext, dto.id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);

      try {
        await cursoRepository.delete(curso.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
