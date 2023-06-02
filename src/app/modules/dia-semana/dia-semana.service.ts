import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { has, isNil, omit } from 'lodash';
import { AppContext } from 'src/app/AppContext/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { DiaSemanaDbEntity } from 'src/database/entities/dia-semana.db.entity';
import { getDiaSemanaRepository } from 'src/database/repositories/dia-semana.repository';
import { INDEX_DIA_SEMANA } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { DiaSemanaType } from './dia-semana.type';
import {
  ICreateDiaSemanaInput,
  IDeleteDiaSemanaInput,
  IFindDiaSemanaByIdInput,
  IUpdateDiaSemanaInput,
  ListDiaSemanaResultType,
} from './dtos';

@Injectable()
export class DiaSemanaService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findDiaSemanaById(
    appContext: AppContext,
    dto: IFindDiaSemanaByIdInput,
    options?: FindOneOptions<DiaSemanaDbEntity>,
  ) {
    const { id } = dto;

    const targetDiaSemana = await appContext.databaseRun(
      async ({ entityManager }) => {
        const diaSemanaRepository = getDiaSemanaRepository(entityManager);

        return diaSemanaRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetDiaSemana) {
      return null;
    }

    const diaSemana = await appContext.databaseRun<DiaSemanaDbEntity>(
      async ({ entityManager }) => {
        const diaSemanaRepository = getDiaSemanaRepository(entityManager);

        return await diaSemanaRepository.findOneOrFail({
          where: { id: targetDiaSemana.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return diaSemana;
  }

  async findDiaSemanaByIdStrict(
    appContext: AppContext,
    dto: IFindDiaSemanaByIdInput,
    options?: FindOneOptions<DiaSemanaDbEntity>,
  ) {
    const diaSemana = await this.findDiaSemanaById(appContext, dto, options);

    if (!diaSemana) {
      throw new NotFoundException();
    }

    return diaSemana;
  }

  async findDiaSemanaByIdStrictSimple(
    appContext: AppContext,
    diaSemanaId: number,
  ): Promise<Pick<DiaSemanaDbEntity, 'id'>> {
    const diaSemana = await this.findDiaSemanaByIdStrict(appContext, {
      id: diaSemanaId,
    });

    return diaSemana as Pick<DiaSemanaDbEntity, 'id'>;
  }

  async findDiaSemanaByOrdem(
    appContext: AppContext,
    ordem: number,
  ): Promise<DiaSemanaDbEntity | null> {
    const diaSemana = await appContext.databaseRun(
      async ({ entityManager }) => {
        const diaSemanaRepository = getDiaSemanaRepository(entityManager);

        return diaSemanaRepository.findOne({
          where: { ordem },
          select: ['id'],
        });
      },
    );

    return diaSemana;
  }

  async listDiaSemana(
    appContext: AppContext,
    dto: IGenericListInput,
  ): Promise<ListDiaSemanaResultType> {
    const result = await this.meilisearchService.listResource<DiaSemanaType>(
      INDEX_DIA_SEMANA,
      dto,
    );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findDiaSemanaById(appContext, {
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

  async getDiaSemanaGenericField<K extends keyof DiaSemanaDbEntity>(
    appContext: AppContext,
    diaSemanaId: number,
    field: K,
  ): Promise<DiaSemanaDbEntity[K]> {
    const diaSemana = await this.findDiaSemanaByIdStrict(
      appContext,
      { id: diaSemanaId },
      { select: ['id', field] },
    );

    return <DiaSemanaDbEntity[K]>diaSemana[field];
  }

  async getDiaSemanaOrdem(
    appContext: AppContext,
    diaSemanaId: number,
  ): Promise<DiaSemanaDbEntity['ordem']> {
    return this.getDiaSemanaGenericField(appContext, diaSemanaId, 'ordem');
  }

  async createDiaSemana(appContext: AppContext, dto: ICreateDiaSemanaInput) {
    const fieldsData = omit(dto, []);

    const diaSemanaForOrdem = await this.findDiaSemanaByOrdem(
      appContext,
      fieldsData.ordem,
    );

    if (diaSemanaForOrdem) {
      throw new ConflictException('Já existe um dia da semana com essa ordem.');
    }

    const diaSemana = await appContext.databaseRun(
      async ({ entityManager }) => {
        const diaSemanaRepository = getDiaSemanaRepository(entityManager);

        const diaSemana = { ...fieldsData };
        await diaSemanaRepository.save(diaSemana);

        return <DiaSemanaDbEntity>diaSemana;
      },
    );

    return this.findDiaSemanaByIdStrictSimple(appContext, diaSemana.id);
  }

  async updateDiaSemana(appContext: AppContext, dto: IUpdateDiaSemanaInput) {
    const { id } = dto;

    const diaSemana = await this.findDiaSemanaByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    const ordem = fieldsData.ordem;

    if (has(fieldsData, 'ordem') && typeof ordem === 'number') {
      const diaSemanaForOrdem = await this.findDiaSemanaByOrdem(
        appContext,
        ordem,
      );

      if (diaSemanaForOrdem && diaSemanaForOrdem.id !== diaSemana.id) {
        throw new ConflictException(
          'Já existe um dia da semana com essa ordem.',
        );
      }
    }

    await appContext.databaseRun(async ({ entityManager }) => {
      const diaSemanaRepository = getDiaSemanaRepository(entityManager);

      const updatedDiaSemana = { ...diaSemana, ...fieldsData };
      await diaSemanaRepository.updateDiaSemana(updatedDiaSemana, diaSemana.id);

      return <DiaSemanaDbEntity>updatedDiaSemana;
    });

    return this.findDiaSemanaByIdStrictSimple(appContext, diaSemana.id);
  }

  async deleteDiaSemana(appContext: AppContext, dto: IDeleteDiaSemanaInput) {
    const diaSemana = await this.findDiaSemanaByIdStrictSimple(
      appContext,
      dto.id,
    );

    return appContext.databaseRun(async ({ entityManager }) => {
      const diaSemanaRepository = getDiaSemanaRepository(entityManager);

      try {
        await diaSemanaRepository.delete(diaSemana.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
