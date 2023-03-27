import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { DisciplinaDbEntity } from '../entities/disciplina.db.entity';

export type IDisciplinaRepository = ReturnType<typeof getDisciplinaRepository>;

export const getDisciplinaRepository = (
  dataSource: DataSource | EntityManager,
) =>
  dataSource.getRepository(DisciplinaDbEntity).extend({
    async updateDisciplina(payload: Partial<DisciplinaDbEntity>, id: number) {
      const updatedData = await this.createQueryBuilder('disciplina')
        .update<DisciplinaDbEntity>(DisciplinaDbEntity, { ...payload })
        .where('disciplina.id = :id', { id: id })
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
