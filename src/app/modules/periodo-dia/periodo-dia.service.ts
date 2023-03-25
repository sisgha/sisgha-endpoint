import { Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { PeriodoDiaDbEntity } from 'src/app/entities/periodo-dia.db.entity';
import { getPeriodoDiaRepository } from 'src/app/repositories/periodo-dia.repository';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { FindOneOptions } from 'typeorm';
import {
  ICreatePeriodoDiaInput,
  IDeletePeriodoDiaInput,
  IFindPeriodoDiaByIdInput,
  IUpdatePeriodoDiaInput,
} from './dtos';

@Injectable()
export class PeriodoDiaService {
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
