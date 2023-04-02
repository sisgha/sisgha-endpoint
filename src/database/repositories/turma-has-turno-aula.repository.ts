import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { TurmaHasTurnoAulaDbEntity } from '../entities/turma-has-turno-aula.db.entity';

export type ITurmaHasTurnoAulaRepository = ReturnType<typeof getTurmaHasTurnoAulaRepository>;

export const getTurmaHasTurnoAulaRepository = (
  dataSource: DataSource | EntityManager,
) =>
  dataSource.getRepository(TurmaHasTurnoAulaDbEntity).extend({
    async updateTurmaHasTurnoAula(payload: Partial<TurmaHasTurnoAulaDbEntity>, id: number) {
      const updatedData = await this.createQueryBuilder('turma_has_turno_aula')
        .update<TurmaHasTurnoAulaDbEntity>( TurmaHasTurnoAulaDbEntity, { ...payload })
        .where('turma_has_turno_aula.id = :id', { id: id })
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
