import { DataSource, EntityManager } from 'typeorm';
import { CargoPermissaoDbEntity } from '../entities/cargo_permissao.db.entity';

export type ICargoPermissaoRepository = ReturnType<typeof getCargoPermissaoRepository>;

export const getCargoPermissaoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(CargoPermissaoDbEntity).extend({});
