import { Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { LugarDbEntity } from 'src/database/entities/lugar.db.entity';
import { getLugarRepository } from 'src/database/repositories/lugar.repository';
import { AppContext } from 'src/app-context/AppContext';
import { FindOneOptions } from 'typeorm';
import {
  ICreateLugarInput,
  IDeleteLugarInput,
  IFindLugarByIdInput,
  IUpdateLugarInput,
} from './dtos';

@Injectable()
export class LugarService {
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
