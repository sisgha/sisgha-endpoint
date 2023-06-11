import { DataSource, EntityManager } from 'typeorm';
import { AtorSimplesCargoDbEntity } from '../entities/ator_simples_cargo.db.entity';

export type IAtorSimplesCargoRepository = ReturnType<typeof getAtorSimplesCargoRepository>;

export const getAtorSimplesCargoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(AtorSimplesCargoDbEntity).extend({});
