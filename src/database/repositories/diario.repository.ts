import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { DiarioDbEntity } from '../entities/diario.db.entity';

export type IDiarioRepository = ReturnType<typeof getDiarioRepository>;

export const getDiarioRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(DiarioDbEntity).extend({
    async updateDiario(payload: Partial<DiarioDbEntity>, id: number) {
      const updatedData = await this.createQueryBuilder('diario')
        .update<DiarioDbEntity>(DiarioDbEntity, { ...payload })
        .where('diario.id = :id', { id: id })
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
