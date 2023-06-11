import { DataSource, EntityManager } from 'typeorm';
import { AtorSimplesDbEntity } from '../entities/ator_simples.db.entity';

export type IAtorSimplesRepository = ReturnType<typeof getAtorSimplesRepository>;

export const getAtorSimplesRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(AtorSimplesDbEntity).extend({});
