import { DataSource, EntityManager } from 'typeorm';
import { IAppResource, IAppResourceDatabase } from '../../../../domain/application-resources';
import { UsuarioInternoModel } from '../../../../domain/models/usuario_interno.model';
import { UsuarioInternoDbEntity } from '../../../database/entities/usuario_interno.db.entity';
import { IUsuarioInternoRepository, getUsuarioInternoRepository } from '../../../database/repositories/usuario_interno.repository';
import { UsuarioInternoPresenter } from './usuario_interno.presenter';

export const APP_RESOURCE_USUARIO_INTERNO = 'usuario_interno';

export type IUsuarioInternoResourceDatabase = IAppResourceDatabase<
  typeof UsuarioInternoDbEntity,
  IUsuarioInternoRepository,
  DataSource | EntityManager
>;

export const UsuarioInternoResourceDatabase: IUsuarioInternoResourceDatabase = {
  getTypeormEntity: () => UsuarioInternoDbEntity,
  getTypeormRepositoryFactory: () => getUsuarioInternoRepository,
};

export type IUsuarioInternoResource = IAppResource<UsuarioInternoModel, IUsuarioInternoResourceDatabase>;

export const UsuarioInternoResource: IUsuarioInternoResource = {
  key: APP_RESOURCE_USUARIO_INTERNO,

  search: {
    meiliSearchIndex: 'usuario_interno',
    searchable: [
      // ...
      'id',

      'tipoEntidade',

      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
    filterable: [
      // ...
      'id',

      'tipoEntidade',

      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
    sortable: [
      // ...
      'id',

      'tipoEntidade',

      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
  },

  presenter: () => new UsuarioInternoPresenter(),
  database: UsuarioInternoResourceDatabase,
};
