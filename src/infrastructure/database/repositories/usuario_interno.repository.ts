import { DataSource, EntityManager } from 'typeorm';
import { UsuarioInternoDbEntity } from '../entities/usuario_interno.db.entity';

export type IUsuarioInternoRepository = ReturnType<typeof getUsuarioInternoRepository>;

export const getUsuarioInternoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(UsuarioInternoDbEntity).extend({});
