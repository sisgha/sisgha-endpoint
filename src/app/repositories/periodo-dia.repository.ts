import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { PeriodoDiaDbEntity } from '../entities/periodo-dia.db.entity';

export type IPeriodoDiaRepository = ReturnType<typeof getPeriodoDiaRepository>;

export const getPeriodoDiaRepository = (
  dataSource: DataSource | EntityManager,
) =>
  dataSource.getRepository(PeriodoDiaDbEntity).extend({
    async updatePeriodoDia(payload: Partial<PeriodoDiaDbEntity>, id: number) {
      const result = await this.createQueryBuilder('periodo_dia')
        .update<PeriodoDiaDbEntity>(PeriodoDiaDbEntity, { ...payload })
        .where('periodo_dia.id = :id', { id: id })
        .returning('*')
        .updateEntity(true)
        .execute();

      const updatedEntity = result.raw[0];

      if (!updatedEntity) {
        throw new ForbiddenException();
      }

      return updatedEntity;
    },
  });
