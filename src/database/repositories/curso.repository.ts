import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CursoDbEntity } from '../entities/curso.db.entity';

export type ICursoRepository = ReturnType<typeof getCursoRepository>;

export const getCursoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(CursoDbEntity).extend({
    async updateCurso(payload: Partial<CursoDbEntity>, id: number) {
      const updatedData = await this.createQueryBuilder('curso')
        .update<CursoDbEntity>(CursoDbEntity, { ...payload })
        .where('curso.id = :id', { id: id })
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
