import { DataSource, EntityManager } from 'typeorm';
import { UsuarioInternoCargoDbEntity } from '../entities/usuario_interno_cargo.db.entity';

export type IUsuarioInternoCargoRepository = ReturnType<typeof getUsuarioInternoCargoRepository>;

export const getUsuarioInternoCargoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(UsuarioInternoCargoDbEntity).extend({});
