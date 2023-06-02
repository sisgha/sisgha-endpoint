import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { AulaDbEntity } from '../entities/aula.db.entity';

export type IAulaRepository = ReturnType<typeof getAulaRepository>;

export const getAulaRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(AulaDbEntity).extend({
    async updateAula(payload: Partial<AulaDbEntity>, id: number) {
      const updatedData = await this.createQueryBuilder('aula')
        .update<AulaDbEntity>(AulaDbEntity, { ...payload })
        .where('aula.id = :id', { id: id })
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
