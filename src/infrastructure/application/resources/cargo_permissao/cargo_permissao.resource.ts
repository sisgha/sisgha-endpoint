import { DataSource, EntityManager } from 'typeorm';
import { IAppResource, IAppResourceDatabase } from '../../../../domain/application-resources';
import { CargoPermissaoModel } from '../../../../domain/models/cargo_permissao.model';
import { CargoPermissaoDbEntity } from '../../../database/entities/cargo_permissao.db.entity';
import { getCargoPermissaoRepository, ICargoPermissaoRepository } from '../../../database/repositories/cargo_permissao.repository';
import { CargoPermissaoPresenter } from './cargo_permissao.presenter';

export const APP_RESOURCE_CARGO_PERMISSAO = 'cargo_permissao';

export type ICargoPermissaoResourceDatabase = IAppResourceDatabase<
  typeof CargoPermissaoDbEntity,
  ICargoPermissaoRepository,
  DataSource | EntityManager
>;

export const CargoPermissaoResourceDatabase: ICargoPermissaoResourceDatabase = {
  getTypeormEntity: () => CargoPermissaoDbEntity,
  getTypeormRepositoryFactory: () => getCargoPermissaoRepository,
};

export type ICargoPermissaoResource = IAppResource<CargoPermissaoModel, ICargoPermissaoResourceDatabase>;

export const CargoPermissaoResource: ICargoPermissaoResource = {
  key: APP_RESOURCE_CARGO_PERMISSAO,
  search: null,
  presenter: () => new CargoPermissaoPresenter(),
  database: CargoPermissaoResourceDatabase,
};
