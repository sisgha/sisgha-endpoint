import { DataSource, EntityManager } from 'typeorm';
import { UsuarioCargoDbEntity } from '../entities/usuario_cargo.db.entity';

export type IUsuarioCargoRepository = ReturnType<typeof getUsuarioCargoRepository>;

export const getUsuarioCargoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(UsuarioCargoDbEntity).extend({});
