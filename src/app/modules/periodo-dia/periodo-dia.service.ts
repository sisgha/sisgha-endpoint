import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { AppContext } from 'src/app-context/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { PeriodoDiaDbEntity } from 'src/database/entities/periodo-dia.db.entity';
import { getPeriodoDiaRepository } from 'src/database/repositories/periodo-dia.repository';
import { INDEX_PERIODO_DIA } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import {
  ICreatePeriodoDiaInput,
  IDeletePeriodoDiaInput,
  IFindPeriodoDiaByIdInput,
  IUpdatePeriodoDiaInput,
  ListPeriodoDiaResultType,
} from './dtos';
import { PeriodoDiaType } from './periodo-dia.type';

@Injectable()
export class PeriodoDiaService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findPeriodoDiaById(
    appContext: AppContext,
    dto: IFindPeriodoDiaByIdInput,
    options?: FindOneOptions<PeriodoDiaDbEntity>,
  ) {
    const { id } = dto;

    const targetPeriodoDia = await appContext.databaseRun(
      async ({ entityManager }) => {
        const periodoDiaRepository = getPeriodoDiaRepository(entityManager);

        return periodoDiaRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetPeriodoDia) {
      return null;
    }

    const periodoDia = await appContext.databaseRun<PeriodoDiaDbEntity>(
      async ({ entityManager }) => {
        const periodoDiaRepository = getPeriodoDiaRepository(entityManager);

        return await periodoDiaRepository.findOneOrFail({
          where: { id: targetPeriodoDia.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return periodoDia;
  }

  async findPeriodoDiaByIdStrict(
    appContext: AppContext,
    dto: IFindPeriodoDiaByIdInput,
    options?: FindOneOptions<PeriodoDiaDbEntity>,
  ) {
    const periodoDia = await this.findPeriodoDiaById(appContext, dto, options);

    if (!periodoDia) {
      throw new NotFoundException();
    }

    return periodoDia;
  }

  async findPeriodoDiaByIdStrictSimple(
    appContext: AppContext,
    periodoDiaId: number,
  ): Promise<Pick<PeriodoDiaDbEntity, 'id'>> {
    const periodoDia = await this.findPeriodoDiaByIdStrict(appContext, {
      id: periodoDiaId,
    });

    return periodoDia as Pick<PeriodoDiaDbEntity, 'id'>;
  }

  async listPeriodoDia(
    appContext: AppContext,
    dto: IGenericListInput,
  ): Promise<ListPeriodoDiaResultType> {
    const result = await this.meilisearchService.listResource<PeriodoDiaType>(
      INDEX_PERIODO_DIA,
      dto,
    );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findPeriodoDiaById(appContext, {
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

  async getPeriodoDiaGenericField<K extends keyof PeriodoDiaDbEntity>(
    appContext: AppContext,
    periodoDiaId: number,
    field: K,
  ): Promise<PeriodoDiaDbEntity[K]> {
    const periodoDia = await this.findPeriodoDiaByIdStrict(
      appContext,
      { id: periodoDiaId },
      { select: ['id', field] },
    );

    return <PeriodoDiaDbEntity[K]>periodoDia[field];
  }

  async getPeriodoDiaHoraInicio(
    appContext: AppContext,
    periodoDiaId: number,
  ): Promise<PeriodoDiaDbEntity['horaInicio']> {
    return this.getPeriodoDiaGenericField(
      appContext,
      periodoDiaId,
      'horaInicio',
    );
  }

  async getPeriodoDiaHoraFim(
    appContext: AppContext,
    periodoDiaId: number,
  ): Promise<PeriodoDiaDbEntity['horaFim']> {
    return this.getPeriodoDiaGenericField(appContext, periodoDiaId, 'horaFim');
  }

  async createPeriodoDia(appContext: AppContext, dto: ICreatePeriodoDiaInput) {
    const fieldsData = omit(dto, []);

    const periodoDia = await appContext.databaseRun(
      async ({ entityManager }) => {
        const periodoDiaRepository = getPeriodoDiaRepository(entityManager);

        const periodoDia = { ...fieldsData };
        await periodoDiaRepository.save(periodoDia);

        return <PeriodoDiaDbEntity>periodoDia;
      },
    );

    return this.findPeriodoDiaByIdStrictSimple(appContext, periodoDia.id);
  }

  async updatePeriodoDia(appContext: AppContext, dto: IUpdatePeriodoDiaInput) {
    const { id } = dto;

    const periodoDia = await this.findPeriodoDiaByIdStrictSimple(
      appContext,
      id,
    );

    const fieldsData = omit(dto, ['id']);

    await appContext.databaseRun(async ({ entityManager }) => {
      const periodoDiaRepository = getPeriodoDiaRepository(entityManager);

      const updatedPeriodoDia = { ...periodoDia, ...fieldsData };

      await periodoDiaRepository.updatePeriodoDia(
        updatedPeriodoDia,
        periodoDia.id,
      );

      return <PeriodoDiaDbEntity>updatedPeriodoDia;
    });

    return this.findPeriodoDiaByIdStrictSimple(appContext, periodoDia.id);
  }

  async deletePeriodoDia(appContext: AppContext, dto: IDeletePeriodoDiaInput) {
    const periodoDia = await this.findPeriodoDiaByIdStrictSimple(
      appContext,
      dto.id,
    );

    return appContext.databaseRun(async ({ entityManager }) => {
      const periodoDiaRepository = getPeriodoDiaRepository(entityManager);

      try {
        await periodoDiaRepository.delete(periodoDia.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
