import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { LugarDbEntity } from '../entities/lugar.db.entity';

export type ILugarRepository = ReturnType<typeof getLugarRepository>;

export const getLugarRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(LugarDbEntity).extend({
    async updateLugar(payload: Partial<LugarDbEntity>, id: number) {
      const updatedData = await this.createQueryBuilder('lugar')
        .update<LugarDbEntity>(LugarDbEntity, { ...payload })
        .where('lugar.id = :id', { id: id })
        .returning('*')
        .updateEntity(true)
        .execute();

      const updatedEntity = updatedData.raw[0];

      if (!updatedEntity) {
        throw new ForbiddenException();
      }

      return updatedEntity;
    },
  });
