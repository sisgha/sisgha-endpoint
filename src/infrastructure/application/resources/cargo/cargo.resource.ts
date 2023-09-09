import { DataSource, EntityManager } from 'typeorm';
import { IAppResource, IAppResourceDatabase } from '../../../../domain/application-resources';
import { CargoModel } from '../../../../domain/models';
import { CargoDbEntity } from '../../../database/entities/cargo.db.entity';
import { ICargoRepository, getCargoRepository } from '../../../database/repositories/cargo.repository';
import { CargoPresenter } from './cargo.presenter';

export const APP_RESOURCE_CARGO = 'cargo';

export type ICargoResourceDatabase = IAppResourceDatabase<typeof CargoDbEntity, ICargoRepository, DataSource | EntityManager>;

export const CargoResourceDatabase: ICargoResourceDatabase = {
  getTypeormEntity: () => CargoDbEntity,
  getTypeormRepositoryFactory: () => getCargoRepository,
};

export type ICargoResource = IAppResource<CargoModel, ICargoResourceDatabase>;

export const CargoResource: ICargoResource = {
  key: APP_RESOURCE_CARGO,

  search: {
    meiliSearchIndex: 'cargo',
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

  presenter: () => new CargoPresenter(),

  database: CargoResourceDatabase,
};
