import { DataSource, EntityManager } from 'typeorm';
import { UsuarioHasCargoDbEntity } from '../entities/usuario-has-cargo.db.entity';

export type IUsuarioHasCargoRepository = ReturnType<
  typeof getUsuarioHasCargoRepository
>;

export const getUsuarioHasCargoRepository = (
  dataSource: DataSource | EntityManager,
) => dataSource.getRepository(UsuarioHasCargoDbEntity).extend({});
