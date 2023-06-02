import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { DiarioProfessorDbEntity } from '../entities/diario-professor.db.entity';

export type IDiarioProfessorRepository = ReturnType<
  typeof getDiarioProfessorRepository
>;

export const getDiarioProfessorRepository = (
  dataSource: DataSource | EntityManager,
) =>
  dataSource.getRepository(DiarioProfessorDbEntity).extend({
    async updateDiarioProfessor(
      payload: Partial<DiarioProfessorDbEntity>,
      id: number,
    ) {
      const updatedData = await this.createQueryBuilder('diario_professor')
        .update<DiarioProfessorDbEntity>(DiarioProfessorDbEntity, {
          ...payload,
        })
        .where('diario_professor.id = :id', { id: id })
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
