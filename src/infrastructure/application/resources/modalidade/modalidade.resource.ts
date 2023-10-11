import { DataSource, EntityManager } from 'typeorm';
import { IAppResource, IAppResourceDatabase } from '../../../../domain/application-resources';
import { ModalidadeModel } from '../../../../domain/models';
import { ModalidadeDbEntity } from '../../../database/entities/modalidade.db.entity';
import { IModalidadeRepository, getModalidadeRepository } from '../../../database/repositories/modalidade.repository';
import { ModalidadePresenter } from './modalidade.presenter';

export const APP_RESOURCE_MODALIDADE = 'modalidade';

export type IModalidadeResourceDatabase = IAppResourceDatabase<
  typeof ModalidadeDbEntity,
  IModalidadeRepository,
  DataSource | EntityManager
>;

export const ModalidadeResourceDatabase: IModalidadeResourceDatabase = {
  getTypeormEntity: () => ModalidadeDbEntity,
  getTypeormRepositoryFactory: () => getModalidadeRepository,
};

export type IModalidadeResource = IAppResource<ModalidadeModel, IModalidadeResourceDatabase>;

export const ModalidadeResource: IModalidadeResource = {
  key: APP_RESOURCE_MODALIDADE,

  search: {
    meiliSearchIndex: 'modalidade',
    searchable: [
      // ...
      'id',
      'slug',
      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
    filterable: [
      // ...
      'id',
      'slug',
      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
    sortable: [
      // ...
      'id',
      'slug',
      'dateCreated',
      'dateUpdated',
      'dateDeleted',
      'dateSearchSync',
    ],
  },

  presenter: () => new ModalidadePresenter(),

  database: ModalidadeResourceDatabase,
};
