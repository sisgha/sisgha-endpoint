import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { AppContext } from 'src/app/AppContext/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { LugarDbEntity } from 'src/database/entities/lugar.db.entity';
import { getLugarRepository } from 'src/database/repositories/lugar.repository';
import { INDEX_LUGAR } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import {
  ICreateLugarInput,
  IDeleteLugarInput,
  IFindLugarByIdInput,
  IUpdateLugarInput,
  ListLugarResultType,
} from './dtos';
import { LugarType } from './lugar.type';

@Injectable()
export class LugarService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findLugarById(
    appContext: AppContext,
    dto: IFindLugarByIdInput,
    options?: FindOneOptions<LugarDbEntity>,
  ) {
    const { id } = dto;

    const targetLugar = await appContext.databaseRun(
      async ({ entityManager }) => {
        const lugarRepository = getLugarRepository(entityManager);

        return lugarRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetLugar) {
      return null;
    }

    const lugar = await appContext.databaseRun<LugarDbEntity>(
      async ({ entityManager }) => {
        const lugarRepository = getLugarRepository(entityManager);

        return await lugarRepository.findOneOrFail({
          where: { id: targetLugar.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return lugar;
  }

  async findLugarByIdStrict(
    appContext: AppContext,
    dto: IFindLugarByIdInput,
    options?: FindOneOptions<LugarDbEntity>,
  ) {
    const lugar = await this.findLugarById(appContext, dto, options);

    if (!lugar) {
      throw new NotFoundException();
    }

    return lugar;
  }

  async findLugarByIdStrictSimple(
    appContext: AppContext,
    lugarId: number,
  ): Promise<Pick<LugarDbEntity, 'id'>> {
    const lugar = await this.findLugarByIdStrict(appContext, {
      id: lugarId,
    });

    return lugar as Pick<LugarDbEntity, 'id'>;
  }

  async listLugar(
    appContext: AppContext,
    dto: IGenericListInput,
  ): Promise<ListLugarResultType> {
    const result = await this.meilisearchService.listResource<LugarType>(
      INDEX_LUGAR,
      dto,
    );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findLugarById(appContext, {
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

  async getLugarGenericField<K extends keyof LugarDbEntity>(
    appContext: AppContext,
    lugarId: number,
    field: K,
  ): Promise<LugarDbEntity[K]> {
    const lugar = await this.findLugarByIdStrict(
      appContext,
      { id: lugarId },
      { select: ['id', field] },
    );

    return <LugarDbEntity[K]>lugar[field];
  }

  async getLugarNumero(
    appContext: AppContext,
    lugarId: number,
  ): Promise<LugarDbEntity['numero']> {
    return this.getLugarGenericField(appContext, lugarId, 'numero');
  }

  async getLugarTipo(
    appContext: AppContext,
    lugarId: number,
  ): Promise<LugarDbEntity['tipo']> {
    return this.getLugarGenericField(appContext, lugarId, 'tipo');
  }

  async getLugarDescricao(
    appContext: AppContext,
    lugarId: number,
  ): Promise<LugarDbEntity['descricao']> {
    return this.getLugarGenericField(appContext, lugarId, 'descricao');
  }

  async createLugar(appContext: AppContext, dto: ICreateLugarInput) {
    const fieldsData = omit(dto, []);

    const lugar = await appContext.databaseRun(async ({ entityManager }) => {
      const lugarRepository = getLugarRepository(entityManager);

      const lugar = { ...fieldsData };
      await lugarRepository.save(lugar);

      return <LugarDbEntity>lugar;
    });

    return this.findLugarByIdStrictSimple(appContext, lugar.id);
  }

  async updateLugar(appContext: AppContext, dto: IUpdateLugarInput) {
    const { id } = dto;

    const lugar = await this.findLugarByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    await appContext.databaseRun(async ({ entityManager }) => {
      const lugarRepository = getLugarRepository(entityManager);

      const updatedLugar = { ...lugar, ...fieldsData };
      await lugarRepository.updateLugar(updatedLugar, lugar.id);

      return <LugarDbEntity>updatedLugar;
    });

    return this.findLugarByIdStrictSimple(appContext, lugar.id);
  }

  async deleteLugar(appContext: AppContext, dto: IDeleteLugarInput) {
    const { id } = dto;

    const lugar = await this.findLugarByIdStrictSimple(appContext, id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const lugarRepository = getLugarRepository(entityManager);

      try {
        await lugarRepository.delete(lugar.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
