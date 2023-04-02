import { Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { SemanaDbEntity } from 'src/database/entities/semana.db.entity';
import { getSemanaRepository } from 'src/database/repositories/semana.repository';
import { AppContext } from 'src/app-context/AppContext';
import { FindOneOptions } from 'typeorm';
import {
  ICreateSemanaInput,
  IDeleteSemanaInput,
  IFindSemanaByIdInput,
  IUpdateSemanaInput,
} from './dtos';

@Injectable()
export class SemanaService {
  async findSemanaById(
    appContext: AppContext,
    dto: IFindSemanaByIdInput,
    options?: FindOneOptions<SemanaDbEntity>,
  ) {
    const { id } = dto;

    const targetSemana = await appContext.databaseRun(
      async ({ entityManager }) => {
        const semanaRepository = getSemanaRepository(entityManager);

        return semanaRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetSemana) {
      return null;
    }

    const semana = await appContext.databaseRun<SemanaDbEntity>(
      async ({ entityManager }) => {
        const semanaRepository = getSemanaRepository(entityManager);

        return await semanaRepository.findOneOrFail({
          where: { id: targetSemana.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return semana;
  }

  async findSemanaByIdStrict(
    appContext: AppContext,
    dto: IFindSemanaByIdInput,
    options?: FindOneOptions<SemanaDbEntity>,
  ) {
    const semana = await this.findSemanaById(appContext, dto, options);

    if (!semana) {
      throw new NotFoundException();
    }

    return semana;
  }

  async findSemanaByIdStrictSimple(
    appContext: AppContext,
    semanaId: number,
  ): Promise<Pick<SemanaDbEntity, 'id'>> {
    const semana = await this.findSemanaByIdStrict(appContext, {
      id: semanaId,
    });

    return semana as Pick<SemanaDbEntity, 'id'>;
  }

  async getSemanaGenericField<K extends keyof SemanaDbEntity>(
    appContext: AppContext,
    semanaId: number,
    field: K,
  ): Promise<SemanaDbEntity[K]> {
    const semana = await this.findSemanaByIdStrict(
      appContext,
      { id: semanaId },
      { select: ['id', field] },
    );

    return <SemanaDbEntity[K]>semana[field];
  }

  async getSemanaDataInicio(appContext: AppContext, semanaId: number) {
    return this.getSemanaGenericField(appContext, semanaId, 'dataInicio');
  }

  async getSemanaDataFim(appContext: AppContext, semanaId: number) {
    return this.getSemanaGenericField(appContext, semanaId, 'dataFim');
  }

  async getSemanaStatus(appContext: AppContext, semanaId: number) {
    return this.getSemanaGenericField(appContext, semanaId, 'status');
  }

  async createSemana(appContext: AppContext, dto: ICreateSemanaInput) {
    const fieldsData = omit(dto, []);

    const semana = await appContext.databaseRun(async ({ entityManager }) => {
      const semanaRepository = getSemanaRepository(entityManager);

      const semana = <SemanaDbEntity>{ ...fieldsData };
      await semanaRepository.save(semana);

      return semana;
    });

    return this.findSemanaByIdStrictSimple(appContext, semana.id);
  }

  async updateSemana(appContext: AppContext, dto: IUpdateSemanaInput) {
    const { id } = dto;

    const semana = await this.findSemanaByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    await appContext.databaseRun(async ({ entityManager }) => {
      const semanaRepository = getSemanaRepository(entityManager);

      const updatedPeriodoDia = <SemanaDbEntity>{ ...semana, ...fieldsData };

      await semanaRepository.updateSemana(updatedPeriodoDia, semana.id);

      return updatedPeriodoDia;
    });

    return this.findSemanaByIdStrictSimple(appContext, semana.id);
  }

  async deleteSemana(appContext: AppContext, dto: IDeleteSemanaInput) {
    const semana = await this.findSemanaByIdStrictSimple(appContext, dto.id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const semanaRepository = getSemanaRepository(entityManager);

      try {
        await semanaRepository.delete(semana.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
