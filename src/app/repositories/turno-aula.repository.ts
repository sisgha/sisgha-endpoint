import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { TurnoAulaDbEntity } from '../entities/turno-aula.db.entity';

export type ITurnoAulaRepository = ReturnType<typeof getTurnoAulaRepository>;

export const getTurnoAulaRepository = (
  dataSource: DataSource | EntityManager,
) =>
  dataSource.getRepository(TurnoAulaDbEntity).extend({
    async updateTurnoAula(payload: Partial<TurnoAulaDbEntity>, id: number) {
      const result = await this.createQueryBuilder('turno_aula')
        .update<TurnoAulaDbEntity>(TurnoAulaDbEntity, { ...payload })
        .where('turno_aula.id = :id', { id: id })
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
