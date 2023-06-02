import { Injectable, NotFoundException } from '@nestjs/common';
import { has, isNil, omit } from 'lodash';
import { AppContext } from 'src/app/AppContext/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { DisciplinaDbEntity } from 'src/database/entities/disciplina.db.entity';
import { LugarDbEntity } from 'src/database/entities/lugar.db.entity';
import { getDisciplinaRepository } from 'src/database/repositories/disciplina.repository';
import { getLugarRepository } from 'src/database/repositories/lugar.repository';
import { INDEX_DISCIPLINA } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { LugarService } from '../lugar/lugar.service';
import { DisciplinaType } from './disciplina.type';
import {
  ICreateDisciplinaInput,
  IDeleteDisciplinaInput,
  IFindDisciplinaByIdInput,
  IUpdateDisciplinaInput,
  ListDisciplinaResultType,
} from './dtos';

@Injectable()
export class DisciplinaService {
  constructor(
    private lugarService: LugarService,
    private meilisearchService: MeiliSearchService,
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
    dto: IGenericListInput,
  ): Promise<ListDisciplinaResultType> {
    const result = await this.meilisearchService.listResource<DisciplinaType>(
      INDEX_DISCIPLINA,
      dto,
    );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findDisciplinaById(appContext, {
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
