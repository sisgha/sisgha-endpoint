import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { AppContext } from 'src/app/AppContext/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { ProfessorDbEntity } from 'src/database/entities/professor.db.entity';
import { getProfessorRepository } from 'src/database/repositories/professor.repository';
import { INDEX_PROFESSOR } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import {
  ICreateProfessorInput,
  IDeleteProfessorInput,
  IFindProfessorByIdInput,
  IUpdateProfessorInput,
  ListProfessorResultType,
} from './dtos';
import { ProfessorType } from './professor.type';

@Injectable()
export class ProfessorService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findProfessorById(
    appContext: AppContext,
    dto: IFindProfessorByIdInput,
    options?: FindOneOptions<ProfessorDbEntity>,
  ) {
    const { id } = dto;

    const targetProfessor = await appContext.databaseRun(
      async ({ entityManager }) => {
        const professorRepository = getProfessorRepository(entityManager);

        return professorRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetProfessor) {
      return null;
    }

    const professor = await appContext.databaseRun<ProfessorDbEntity>(
      async ({ entityManager }) => {
        const professorRepository = getProfessorRepository(entityManager);

        return await professorRepository.findOneOrFail({
          where: { id: targetProfessor.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return professor;
  }

  async findProfessorByIdStrict(
    appContext: AppContext,
    dto: IFindProfessorByIdInput,
    options?: FindOneOptions<ProfessorDbEntity>,
  ) {
    const professor = await this.findProfessorById(appContext, dto, options);

    if (!professor) {
      throw new NotFoundException();
    }

    return professor;
  }

  async findProfessorByIdStrictSimple(
    appContext: AppContext,
    professorId: number,
  ): Promise<Pick<ProfessorDbEntity, 'id'>> {
    const professor = await this.findProfessorByIdStrict(appContext, {
      id: professorId,
    });

    return professor as Pick<ProfessorDbEntity, 'id'>;
  }

  async listProfessor(
    appContext: AppContext,
    dto: IGenericListInput,
  ): Promise<ListProfessorResultType> {
    const result = await this.meilisearchService.listResource<ProfessorType>(
      INDEX_PROFESSOR,
      dto,
    );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findProfessorById(appContext, {
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

  async getProfessorGenericField<K extends keyof ProfessorDbEntity>(
    appContext: AppContext,
    professorId: number,
    field: K,
  ): Promise<ProfessorDbEntity[K]> {
    const professor = await this.findProfessorByIdStrict(
      appContext,
      { id: professorId },
      { select: ['id', field] },
    );

    return <ProfessorDbEntity[K]>professor[field];
  }

  /*
  async getProfessorGenericField(appContext: app-context, professorId: number) {
    return this.getProfessorGenericField(appContext, professorId, 'genericField');
  }
  */

  async getProfessorNome(appContext: AppContext, professorId: number) {
    return this.getProfessorGenericField(appContext, professorId, 'nome');
  }

  async createProfessor(appContext: AppContext, dto: ICreateProfessorInput) {
    const fieldsData = omit(dto, []);

    const professor = <ProfessorDbEntity>{ ...fieldsData };

    await appContext.databaseRun(async ({ entityManager }) => {
      const professorRepository = getProfessorRepository(entityManager);

      await professorRepository.save(professor);

      return professor;
    });

    return this.findProfessorByIdStrictSimple(appContext, professor.id);
  }

  async updateProfessor(appContext: AppContext, dto: IUpdateProfessorInput) {
    const { id } = dto;

    const professor = await this.findProfessorByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    const updatedProfessor = <ProfessorDbEntity>{ ...professor, ...fieldsData };

    await appContext.databaseRun(async ({ entityManager }) => {
      const professorRepository = getProfessorRepository(entityManager);

      await professorRepository.updateProfessor(updatedProfessor, professor.id);

      return updatedProfessor;
    });

    return this.findProfessorByIdStrictSimple(appContext, professor.id);
  }

  async deleteProfessor(appContext: AppContext, dto: IDeleteProfessorInput) {
    const professor = await this.findProfessorByIdStrictSimple(
      appContext,
      dto.id,
    );

    return appContext.databaseRun(async ({ entityManager }) => {
      const professorRepository = getProfessorRepository(entityManager);

      try {
        await professorRepository.delete(professor.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
