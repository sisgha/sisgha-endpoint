import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { SemanaDbEntity } from '../entities/semana.db.entity';

export type ISemanaRepository = ReturnType<typeof getSemanaRepository>;

export const getSemanaRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(SemanaDbEntity).extend({
    async updateSemana(payload: Partial<SemanaDbEntity>, id: number) {
      const updatedData = await this.createQueryBuilder('semana')
        .update<SemanaDbEntity>(SemanaDbEntity, { ...payload })
        .where('semana.id = :id', { id: id })
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
