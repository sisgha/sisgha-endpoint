import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { TurmaDbEntity } from '../entities/turma.db.entity';

export type ITurmaRepository = ReturnType<typeof getTurmaRepository>;

export const getTurmaRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(TurmaDbEntity).extend({
    async updateTurma(payload: Partial<TurmaDbEntity>, id: number) {
      const updatedData = await this.createQueryBuilder('turma')
        .update<TurmaDbEntity>(TurmaDbEntity, { ...payload })
        .where('turma.id = :id', { id: id })
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
