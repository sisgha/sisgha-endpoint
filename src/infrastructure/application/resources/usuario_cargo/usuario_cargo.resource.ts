import { DataSource, EntityManager } from 'typeorm';
import { IAppResource, IAppResourceDatabase } from '../../../../domain/application-resources';
import { UsuarioCargoModel } from '../../../../domain/models/usuario_cargo.model';
import { UsuarioCargoDbEntity } from '../../../database/entities/usuario_cargo.db.entity';
import { IUsuarioCargoRepository, getUsuarioCargoRepository } from '../../../database/repositories/usuario_cargo.repository';
import { UsuarioCargoPresenter } from './usuario_cargo.presenter';

export const APP_RESOURCE_USUARIO_CARGO = 'usuario_cargo';

export type IUsuarioCargoResourceDatabase = IAppResourceDatabase<
  typeof UsuarioCargoDbEntity,
  IUsuarioCargoRepository,
  DataSource | EntityManager
>;

export const UsuarioCargoResourceDatabase: IUsuarioCargoResourceDatabase = {
  getTypeormEntity: () => UsuarioCargoDbEntity,
  getTypeormRepositoryFactory: () => getUsuarioCargoRepository,
};

export type IUsuarioCargoResource = IAppResource<UsuarioCargoModel, IUsuarioCargoResourceDatabase>;

export const UsuarioCargoResource: IUsuarioCargoResource = {
  key: APP_RESOURCE_USUARIO_CARGO,
  search: null,
  presenter: () => new UsuarioCargoPresenter(),
  database: UsuarioCargoResourceDatabase,
};
