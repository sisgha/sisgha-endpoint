import { DataSource, EntityManager } from 'typeorm';
import { IAppResource, IAppResourceDatabase } from '../../../../domain/application-resources';
import { UsuarioModel } from '../../../../domain/models/usuario.model';
import { UsuarioDbEntity } from '../../../database/entities/usuario.db.entity';
import { getUsuarioRepository, IUsuarioRepository } from '../../../database/repositories/usuario.repository';
import { UsuarioPresenter } from './usuario.presenter';

export const APP_RESOURCE_USUARIO = 'usuario';

export type IUsuarioResourceDatabase = IAppResourceDatabase<typeof UsuarioDbEntity, IUsuarioRepository, DataSource | EntityManager>;

export const UsuarioResourceDatabase: IUsuarioResourceDatabase = {
  getTypeormEntity: () => UsuarioDbEntity,
  getTypeormRepositoryFactory: () => getUsuarioRepository,
};

export type IUsuarioResource = IAppResource<UsuarioModel, IUsuarioResourceDatabase>;

export const UsuarioResource: IUsuarioResource = {
  key: APP_RESOURCE_USUARIO,

  search: {
    meiliSearchIndex: 'usuario',
    searchable: ['id', 'email', 'matriculaSiape'],
    filterable: ['id', 'email', 'matriculaSiape'],
    sortable: ['id', 'email', 'matriculaSiape'],
  },

  presenter: () => new UsuarioPresenter(),

  database: UsuarioResourceDatabase,
};
