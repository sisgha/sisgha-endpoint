import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { DiaSemanaDbEntity } from '../entities/dia-semana.db.entity';

export type IDiaSemanaRepository = ReturnType<typeof getDiaSemanaRepository>;

export const getDiaSemanaRepository = (
  dataSource: DataSource | EntityManager,
) =>
  dataSource.getRepository(DiaSemanaDbEntity).extend({
    async updateDiaSemana(payload: Partial<DiaSemanaDbEntity>, id: number) {
      const updatedData = await this.createQueryBuilder('dia_semana')
        .update<DiaSemanaDbEntity>(DiaSemanaDbEntity, { ...payload })
        .where('dia_semana.id = :id', { id: id })
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
