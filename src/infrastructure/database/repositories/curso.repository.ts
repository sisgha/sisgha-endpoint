import { DataSource, EntityManager } from 'typeorm';
import { CursoDbEntity } from '../entities/curso.db.entity';

export type ICursoRepository = ReturnType<typeof getCursoRepository>;

export const getCursoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(CursoDbEntity).extend({
    // ...
  });
