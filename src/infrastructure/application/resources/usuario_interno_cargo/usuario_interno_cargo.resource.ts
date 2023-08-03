import { DataSource, EntityManager } from 'typeorm';
import { IAppResource, IAppResourceDatabase } from '../../../../domain/application-resources';
import { UsuarioInternoCargoModel } from '../../../../domain/models/usuario_interno_cargo.model';
import { UsuarioInternoCargoDbEntity } from '../../../database/entities/usuario_interno_cargo.db.entity';
import {
  getUsuarioInternoCargoRepository,
  IUsuarioInternoCargoRepository,
} from '../../../database/repositories/usuario_interno_cargo.repository';
import { UsuarioInternoCargoPresenter } from './usuario_interno_cargo.presenter';

export const APP_RESOURCE_USUARIO_INTERNO_CARGO = 'usuario_interno_cargo';

export type IUsuarioInternoCargoResourceDatabase = IAppResourceDatabase<
  typeof UsuarioInternoCargoDbEntity,
  IUsuarioInternoCargoRepository,
  DataSource | EntityManager
>;

export const UsuarioInternoCargoResourceDatabase: IUsuarioInternoCargoResourceDatabase = {
  getTypeormEntity: () => UsuarioInternoCargoDbEntity,
  getTypeormRepositoryFactory: () => getUsuarioInternoCargoRepository,
};

export type IUsuarioInternoCargoResource = IAppResource<UsuarioInternoCargoModel, IUsuarioInternoCargoResourceDatabase>;

export const UsuarioInternoCargoResource: IUsuarioInternoCargoResource = {
  key: APP_RESOURCE_USUARIO_INTERNO_CARGO,
  search: null,
  presenter: () => new UsuarioInternoCargoPresenter(),
  database: UsuarioInternoCargoResourceDatabase,
};
