import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { DisciplinaCursoDbEntity } from '../entities/disciplina-curso.db.entity';

export type IDisciplinaCursoRepository = ReturnType<typeof getDisciplinaCursoRepository>;

export const getDisciplinaCursoRepository = (
  dataSource: DataSource | EntityManager,
) =>
  dataSource.getRepository(DisciplinaCursoDbEntity).extend({
    async updateDisciplinaCurso(payload: Partial<DisciplinaCursoDbEntity>, id: number) {
      const updatedData = await this.createQueryBuilder('disciplina_curso')
        .update<DisciplinaCursoDbEntity>( DisciplinaCursoDbEntity, { ...payload })
        .where('disciplina_curso.id = :id', { id: id })
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
