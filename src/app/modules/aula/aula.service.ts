import { Injectable, NotFoundException } from '@nestjs/common';
import { has, isNil, isUndefined, omit } from 'lodash';
import { AppContext } from 'src/app/AppContext/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { AulaDbEntity } from 'src/database/entities/aula.db.entity';
import { DiarioDbEntity } from 'src/database/entities/diario.db.entity';
import { LugarDbEntity } from 'src/database/entities/lugar.db.entity';
import { SemanaDbEntity } from 'src/database/entities/semana.db.entity';
import { TurnoAulaDbEntity } from 'src/database/entities/turno-aula.db.entity';
import { getAulaRepository } from 'src/database/repositories/aula.repository';
import { getDiarioRepository } from 'src/database/repositories/diario.repository';
import { getLugarRepository } from 'src/database/repositories/lugar.repository';
import { getSemanaRepository } from 'src/database/repositories/semana.repository';
import { getTurnoAulaRepository } from 'src/database/repositories/turno-aula.repository';
import { INDEX_AULA } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { DiarioService } from '../diario/diario.service';
import { LugarService } from '../lugar/lugar.service';
import { SemanaService } from '../semana/semana.service';
import { TurnoAulaService } from '../turno-aula/turno-aula.service';
import { AulaType } from './aula.type';
import {
  ICreateAulaInput,
  IDeleteAulaInput,
  IFindAulaByIdInput,
  IUpdateAulaInput,
  ListAulaResultType,
} from './dtos';

@Injectable()
export class AulaService {
  constructor(
    private diarioService: DiarioService,
    private semanaService: SemanaService,
    private turnoAulaService: TurnoAulaService,
    private lugarService: LugarService,
    private meilisearchService: MeiliSearchService,
  ) {}

  async findAulaById(
    appContext: AppContext,
    dto: IFindAulaByIdInput,
    options?: FindOneOptions<AulaDbEntity>,
  ) {
    const { id } = dto;

    const targetAula = await appContext.databaseRun(
      async ({ entityManager }) => {
        const aulaRepository = getAulaRepository(entityManager);

        return aulaRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetAula) {
      return null;
    }

    const aula = await appContext.databaseRun<AulaDbEntity>(
      async ({ entityManager }) => {
        const aulaRepository = getAulaRepository(entityManager);

        return await aulaRepository.findOneOrFail({
          where: { id: targetAula.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return aula;
  }

  async findAulaByIdStrict(
    appContext: AppContext,
    dto: IFindAulaByIdInput,
    options?: FindOneOptions<AulaDbEntity>,
  ) {
    const aula = await this.findAulaById(appContext, dto, options);

    if (!aula) {
      throw new NotFoundException();
    }

    return aula;
  }

  async findAulaByIdStrictSimple(
    appContext: AppContext,
    aulaId: number,
  ): Promise<Pick<AulaDbEntity, 'id'>> {
    const aula = await this.findAulaByIdStrict(appContext, {
      id: aulaId,
    });

    return aula as Pick<AulaDbEntity, 'id'>;
  }

  async listAula(
    appContext: AppContext,
    dto: IGenericListInput,
  ): Promise<ListAulaResultType> {
    const result = await this.meilisearchService.listResource<AulaType>(
      INDEX_AULA,
      dto,
    );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findAulaById(appContext, {
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

  async getAulaGenericField<K extends keyof AulaDbEntity>(
    appContext: AppContext,
    aulaId: number,
    field: K,
  ): Promise<AulaDbEntity[K]> {
    const aula = await this.findAulaByIdStrict(
      appContext,
      { id: aulaId },
      { select: ['id', field] },
    );

    return <AulaDbEntity[K]>aula[field];
  }

  /*
  async getAulaGenericField(appContext: app-context, aulaId: number) {
    return this.getAulaGenericField(appContext, aulaId, 'genericField');
  }
  */

  async getAulaDiario(appContext: AppContext, aulaId: number) {
    const aula = await this.findAulaByIdStrictSimple(appContext, aulaId);

    const diario = await appContext.databaseRun(async ({ entityManager }) => {
      const diarioRepository = getDiarioRepository(entityManager);

      return diarioRepository
        .createQueryBuilder('diario')
        .innerJoin('diario.aulas', 'aula')
        .where('aula.id = :aulaId', { aulaId: aula.id })
        .select(['diario.id'])
        .getOne();
    });

    return diario;
  }

  async getAulaSemana(appContext: AppContext, aulaId: number) {
    const aula = await this.findAulaByIdStrictSimple(appContext, aulaId);

    const semana = await appContext.databaseRun(async ({ entityManager }) => {
      const semanaRepository = getSemanaRepository(entityManager);

      return semanaRepository
        .createQueryBuilder('semana')
        .innerJoin('semana.aulas', 'aula')
        .where('aula.id = :aulaId', { aulaId: aula.id })
        .select(['semana.id'])
        .getOne();
    });

    return semana;
  }

  async getAulaTurnoAula(appContext: AppContext, aulaId: number) {
    const aula = await this.findAulaByIdStrictSimple(appContext, aulaId);

    const turnoAula = await appContext.databaseRun(
      async ({ entityManager }) => {
        const turnoAulaRepository = getTurnoAulaRepository(entityManager);

        return turnoAulaRepository
          .createQueryBuilder('turno_aula')
          .innerJoin('turno_aula.aulas', 'aula')
          .where('aula.id = :aulaId', { aulaId: aula.id })
          .select(['turno_aula.id'])
          .getOne();
      },
    );

    return turnoAula;
  }

  async getAulaLugar(appContext: AppContext, aulaId: number) {
    const aula = await this.findAulaByIdStrictSimple(appContext, aulaId);

    const lugar = await appContext.databaseRun(async ({ entityManager }) => {
      const lugarRepository = getLugarRepository(entityManager);

      return lugarRepository
        .createQueryBuilder('lugar')
        .innerJoin('lugar.aulas', 'aula')
        .where('aula.id = :aulaId', { aulaId: aula.id })
        .select(['lugar.id'])
        .getOne();
    });

    return lugar;
  }

  async createAula(appContext: AppContext, dto: ICreateAulaInput) {
    const fieldsData = omit(dto, [
      'diarioId',
      'semanaId',
      'turnoAulaId',
      'lugarId',
    ]);

    const aula = <AulaDbEntity>{ ...fieldsData };

    const { diarioId } = dto;

    const diario = await this.diarioService.findDiarioByIdStrictSimple(
      appContext,
      diarioId,
    );

    aula.diario = <DiarioDbEntity>diario;

    const { semanaId } = dto;

    if (semanaId !== null) {
      const semana = await this.semanaService.findSemanaByIdStrictSimple(
        appContext,
        semanaId,
      );

      aula.semana = <SemanaDbEntity>semana;
    } else {
      aula.semana = null;
    }

    const { turnoAulaId } = dto;

    if (turnoAulaId !== null) {
      const turnoAula =
        await this.turnoAulaService.findTurnoAulaByIdStrictSimple(
          appContext,
          turnoAulaId,
        );

      aula.turnoAula = <TurnoAulaDbEntity>turnoAula;
    } else {
      aula.turnoAula = null;
    }

    const { lugarId } = dto;

    if (lugarId !== null) {
      const lugar = await this.lugarService.findLugarByIdStrictSimple(
        appContext,
        lugarId,
      );

      aula.lugar = <LugarDbEntity>lugar;
    } else {
      aula.lugar = null;
    }

    await appContext.databaseRun(async ({ entityManager }) => {
      const aulaRepository = getAulaRepository(entityManager);

      await aulaRepository.save(aula);

      return aula;
    });

    return this.findAulaByIdStrictSimple(appContext, aula.id);
  }

  async updateAula(appContext: AppContext, dto: IUpdateAulaInput) {
    const { id } = dto;

    const aula = await this.findAulaByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, [
      'id',
      'diarioId',
      'semanaId',
      'turnoAulaId',
      'lugarId',
    ]);

    const updatedAula = <AulaDbEntity>{ ...aula, ...fieldsData };

    const { diarioId } = dto;

    if (has(dto, 'diarioId') && !isUndefined(diarioId)) {
      const diario = await this.diarioService.findDiarioByIdStrictSimple(
        appContext,
        diarioId,
      );

      updatedAula.diario = <DiarioDbEntity>diario;
    }

    const { semanaId } = dto;

    if (has(dto, 'semanaId') && !isUndefined(semanaId)) {
      if (semanaId !== null) {
        const semana = await this.semanaService.findSemanaByIdStrictSimple(
          appContext,
          semanaId,
        );

        updatedAula.semana = <SemanaDbEntity>semana;
      } else {
        updatedAula.semana = null;
      }
    }

    const { turnoAulaId } = dto;

    if (has(dto, 'turnoAulaId') && !isUndefined(turnoAulaId)) {
      if (turnoAulaId !== null) {
        const turnoAula =
          await this.turnoAulaService.findTurnoAulaByIdStrictSimple(
            appContext,
            turnoAulaId,
          );

        updatedAula.turnoAula = <TurnoAulaDbEntity>turnoAula;
      } else {
        updatedAula.turnoAula = null;
      }
    }

    const { lugarId } = dto;

    if (has(dto, 'lugarId') && !isUndefined(lugarId)) {
      if (lugarId !== null) {
        const lugar = await this.lugarService.findLugarByIdStrictSimple(
          appContext,
          lugarId,
        );

        updatedAula.lugar = <LugarDbEntity>lugar;
      } else {
        updatedAula.lugar = null;
      }
    }

    await appContext.databaseRun(async ({ entityManager }) => {
      const aulaRepository = getAulaRepository(entityManager);

      await aulaRepository.updateAula(updatedAula, aula.id);

      return updatedAula;
    });

    return this.findAulaByIdStrictSimple(appContext, aula.id);
  }

  async deleteAula(appContext: AppContext, dto: IDeleteAulaInput) {
    const aula = await this.findAulaByIdStrictSimple(appContext, dto.id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const aulaRepository = getAulaRepository(entityManager);

      try {
        await aulaRepository.delete(aula.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
