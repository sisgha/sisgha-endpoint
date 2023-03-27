import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ProfessorDbEntity } from '../entities/professor.db.entity';

export type IProfessorRepository = ReturnType<typeof getProfessorRepository>;

export const getProfessorRepository = (
  dataSource: DataSource | EntityManager,
) =>
  dataSource.getRepository(ProfessorDbEntity).extend({
    async updateProfessor(payload: Partial<ProfessorDbEntity>, id: number) {
      const updatedData = await this.createQueryBuilder('professor')
        .update<ProfessorDbEntity>( ProfessorDbEntity, { ...payload })
        .where('professor.id = :id', { id: id })
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
