import { DataSource, EntityManager } from 'typeorm';
import { IAppResource, IAppResourceDatabase } from '../../../../domain/application-resources';
import { PermissaoModel } from '../../../../domain/models/permissao.model';
import { PermissaoDbEntity } from '../../../database/entities/permissao.db.entity';
import { IPermissaoRepository, getPermissaoRepository } from '../../../database/repositories/permissao.repository';
import { PermissaoPresenter } from './permissao.presenter';

export const APP_RESOURCE_PERMISSAO = 'permissao';

export type IPermissaoResourceDatabase = IAppResourceDatabase<typeof PermissaoDbEntity, IPermissaoRepository, DataSource | EntityManager>;

export const PermissaoResourceDatabase: IPermissaoResourceDatabase = {
  getTypeormEntity: () => PermissaoDbEntity,
  getTypeormRepositoryFactory: () => getPermissaoRepository,
};

export type IPermissaoResource = IAppResource<PermissaoModel, IPermissaoResourceDatabase>;

export const PermissaoResource: IPermissaoResource = {
  key: APP_RESOURCE_PERMISSAO,

  search: {
    meiliSearchIndex: 'permissao',
    searchable: [
      // ...
      'id',

      'descricao',
      'verboGlobal',
      'recursoGlobal',
      'authorizationConstraintRecipe',

      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
    filterable: [
      // ...
      'id',

      'descricao',
      'verboGlobal',
      'recursoGlobal',

      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
    sortable: [
      // ...
      'id',

      'descricao',
      'verboGlobal',
      'recursoGlobal',

      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
  },

  presenter: () => new PermissaoPresenter(),

  database: PermissaoResourceDatabase,
};
