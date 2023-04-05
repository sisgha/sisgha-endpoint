import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { isNil, isNumber, omit } from 'lodash';
import { AppContext } from 'src/app-context/AppContext';
import { DiaSemanaDbEntity } from 'src/database/entities/dia-semana.db.entity';
import { PeriodoDiaDbEntity } from 'src/database/entities/periodo-dia.db.entity';
import { TurnoAulaDbEntity } from 'src/database/entities/turno-aula.db.entity';
import { getDiaSemanaRepository } from 'src/database/repositories/dia-semana.repository';
import { getPeriodoDiaRepository } from 'src/database/repositories/periodo-dia.repository';
import { getTurnoAulaRepository } from 'src/database/repositories/turno-aula.repository';
import { FindOneOptions } from 'typeorm';
import { DiaSemanaService } from '../dia-semana/dia-semana.service';
import { PeriodoDiaService } from '../periodo-dia/periodo-dia.service';
import {
  ICreateTurnoAulaInput,
  IDeleteTurnoAulaInput,
  IFindTurnoAulaByIdInput,
  IListTurnoAulaInput,
  IUpdateTurnoAulaInput,
  ListTurnoAulaResultType,
} from './dtos';
import { TurnoAulaType } from './turno-aula.type';
import MeiliSearch from 'meilisearch';
import { parralelMap } from 'src/common/utils/parralel-map';
import { MEILISEARCH_CLIENT } from 'src/meilisearch/constants/MEILISEARCH_CLIENT.const';
import { INDEX_TURNO_AULA } from 'src/meilisearch/constants/meilisearch-tokens';

@Injectable()
export class TurnoAulaService {
  constructor(
    private diaSemanaService: DiaSemanaService,
    private periodoDiaService: PeriodoDiaService,

    @Inject(MEILISEARCH_CLIENT)
    private meilisearchClient: MeiliSearch,
  ) {}

  async findTurnoAulaById(
    appContext: AppContext,
    dto: IFindTurnoAulaByIdInput,
    options?: FindOneOptions<TurnoAulaDbEntity>,
  ) {
    const { id } = dto;

    const targetTurnoAula = await appContext.databaseRun(
      async ({ entityManager }) => {
        const turnoAulaRepository = getTurnoAulaRepository(entityManager);

        return turnoAulaRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetTurnoAula) {
      return null;
    }

    const turnoAula = await appContext.databaseRun<TurnoAulaDbEntity>(
      async ({ entityManager }) => {
        const turnoAulaRepository = getTurnoAulaRepository(entityManager);

        return await turnoAulaRepository.findOneOrFail({
          where: { id: targetTurnoAula.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return turnoAula;
  }

  async findTurnoAulaByIdStrict(
    appContext: AppContext,
    dto: IFindTurnoAulaByIdInput,
    options?: FindOneOptions<TurnoAulaDbEntity>,
  ) {
    const turnoAula = await this.findTurnoAulaById(appContext, dto, options);

    if (!turnoAula) {
      throw new NotFoundException();
    }

    return turnoAula;
  }

  async findTurnoAulaByIdStrictSimple(
    appContext: AppContext,
    turnoAulaId: number,
  ): Promise<Pick<TurnoAulaDbEntity, 'id'>> {
    const turnoAula = await this.findTurnoAulaByIdStrict(appContext, {
      id: turnoAulaId,
    });

    return turnoAula as Pick<TurnoAulaDbEntity, 'id'>;
  }

  async listTurnoAula(
    appContext: AppContext,
    dto: IListTurnoAulaInput,
  ): Promise<ListTurnoAulaResultType> {
    const { query, limit, offset } = dto;

    const meilisearchResult = await this.meilisearchClient
      .index(INDEX_TURNO_AULA)
      .search<TurnoAulaType>(query, { limit, offset });

    const items = await parralelMap(meilisearchResult.hits, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const turnoAula = await this.findTurnoAulaById(appContext, {
          id: hit.id,
        });

        if (turnoAula) {
          return turnoAula;
        }
      }

      return null;
    });

    const result: ListTurnoAulaResultType = {
      query: meilisearchResult.query,

      limit: meilisearchResult.limit,
      offset: meilisearchResult.offset,

      total: meilisearchResult.estimatedTotalHits,

      items: items,
    };

    return result;
  }

  async getTurnoAulaGenericField<K extends keyof TurnoAulaDbEntity>(
    appContext: AppContext,
    turnoAulaId: number,
    field: K,
  ): Promise<TurnoAulaDbEntity[K]> {
    const turnoAula = await this.findTurnoAulaByIdStrict(
      appContext,
      { id: turnoAulaId },
      { select: ['id', field] },
    );

    return <TurnoAulaDbEntity[K]>turnoAula[field];
  }

  async getTurnoAulaDiaSemana(appContext: AppContext, turnoAulaId: number) {
    const turnoAula = await this.findTurnoAulaByIdStrictSimple(
      appContext,
      turnoAulaId,
    );

    const diaSemana = await appContext.databaseRun(
      async ({ entityManager }) => {
        const diaSemanaRepository = getDiaSemanaRepository(entityManager);

        return diaSemanaRepository
          .createQueryBuilder('dia_semana')
          .innerJoin('dia_semana.turnoAula', 'turno_aula')
          .where('turno_aula.id = :turnoAulaId', { turnoAulaId: turnoAula.id })
          .select(['dia_semana.id'])
          .getOne();
      },
    );

    return diaSemana;
  }

  async getTurnoAulaPeriodoDia(appContext: AppContext, turnoAulaId: number) {
    const turnoAula = await this.findTurnoAulaByIdStrictSimple(
      appContext,
      turnoAulaId,
    );

    const periodoDia = await appContext.databaseRun(
      async ({ entityManager }) => {
        const periodoDiaRepository = getPeriodoDiaRepository(entityManager);

        return periodoDiaRepository
          .createQueryBuilder('periodo_dia')
          .innerJoin('periodo_dia.turnoAula', 'turno_aula')
          .where('turno_aula.id = :turnoAulaId', { turnoAulaId: turnoAula.id })
          .select(['periodo_dia.id'])
          .getOne();
      },
    );

    return periodoDia;
  }

  async createTurnoAula(appContext: AppContext, dto: ICreateTurnoAulaInput) {
    const fieldsData = omit(dto, ['diaSemanaId', 'periodoDiaId']);

    const diaSemana = await this.diaSemanaService.findDiaSemanaByIdStrictSimple(
      appContext,
      dto.diaSemanaId,
    );

    const periodoDia =
      await this.periodoDiaService.findPeriodoDiaByIdStrictSimple(
        appContext,
        dto.periodoDiaId,
      );

    const turnoAula = await appContext.databaseRun(
      async ({ entityManager }) => {
        const turnoAulaRepository = getTurnoAulaRepository(entityManager);

        const turnoAula = <TurnoAulaDbEntity>{ ...fieldsData };

        turnoAula.diaSemana = <DiaSemanaDbEntity>diaSemana;
        turnoAula.periodoDia = <PeriodoDiaDbEntity>periodoDia;

        await turnoAulaRepository.save(turnoAula);

        return <TurnoAulaDbEntity>turnoAula;
      },
    );

    return this.findTurnoAulaByIdStrictSimple(appContext, turnoAula.id);
  }

  async updateTurnoAula(appContext: AppContext, dto: IUpdateTurnoAulaInput) {
    const { id } = dto;

    const turnoAula = await this.findTurnoAulaByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id', 'diaSemanaId', 'periodoDiaId']);

    const { diaSemanaId, periodoDiaId } = dto;

    const diaSemana = isNumber(diaSemanaId)
      ? await this.diaSemanaService.findDiaSemanaByIdStrictSimple(
          appContext,
          diaSemanaId,
        )
      : undefined;

    const periodoDia = isNumber(periodoDiaId)
      ? await this.periodoDiaService.findPeriodoDiaByIdStrictSimple(
          appContext,
          periodoDiaId,
        )
      : undefined;

    await appContext.databaseRun(async ({ entityManager }) => {
      const turnoAulaRepository = getTurnoAulaRepository(entityManager);

      const updatedTurnoAula = <TurnoAulaDbEntity>{
        ...turnoAula,
        ...fieldsData,
      };

      if (diaSemana !== undefined) {
        updatedTurnoAula.diaSemana = <DiaSemanaDbEntity>diaSemana;
      }

      if (periodoDia !== undefined) {
        updatedTurnoAula.periodoDia = <PeriodoDiaDbEntity>periodoDia;
      }

      await turnoAulaRepository.updateTurnoAula(updatedTurnoAula, turnoAula.id);

      return <TurnoAulaDbEntity>updatedTurnoAula;
    });

    return this.findTurnoAulaByIdStrictSimple(appContext, turnoAula.id);
  }

  async deleteTurnoAula(appContext: AppContext, dto: IDeleteTurnoAulaInput) {
    const turnoAula = await this.findTurnoAulaByIdStrictSimple(
      appContext,
      dto.id,
    );

    return appContext.databaseRun(async ({ entityManager }) => {
      const turnoAulaRepository = getTurnoAulaRepository(entityManager);

      try {
        await turnoAulaRepository.delete(turnoAula.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
