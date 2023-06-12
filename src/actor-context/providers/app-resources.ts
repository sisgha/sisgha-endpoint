import { UsuarioInternoDbEntity } from 'src/database/entities/usuario_interno.db.entity';
import { UsuarioInternoCargoDbEntity } from 'src/database/entities/usuario_interno_cargo.db.entity';
import { getUsuarioInternoRepository } from 'src/database/repositories/usuario_interno.repository';
import { getUsuarioInternoCargoRepository } from 'src/database/repositories/usuario_interno_cargo.repository';
import { CargoDbEntity } from '../../database/entities/cargo.db.entity';
import { CargoPermissaoDbEntity } from '../../database/entities/cargo_permissao.db.entity';
import { PermissaoDbEntity } from '../../database/entities/permissao.db.entity';
import { UsuarioDbEntity } from '../../database/entities/usuario.db.entity';
import { UsuarioCargoDbEntity } from '../../database/entities/usuario_cargo.db.entity';
import { getCargoRepository } from '../../database/repositories/cargo.repository';
import { getCargoPermissaoRepository } from '../../database/repositories/cargo_permissao.repository';
import { getPermissaoRepository } from '../../database/repositories/permissao.repository';
import { getUsuarioRepository } from '../../database/repositories/usuario.repository';
import { getUsuarioCargoRepository } from '../../database/repositories/usuario_cargo.repository';
import { IAppResource } from '../interfaces';

export const APP_RESOURCE_PERMISSAO = 'permissao';
export const APP_RESOURCE_CARGO = 'cargo';
export const APP_RESOURCE_CARGO_PERMISSAO = 'cargo_permissao';
export const APP_RESOURCE_USUARIO = 'usuario';
export const APP_RESOURCE_USUARIO_CARGO = 'usuario_cargo';
export const APP_RESOURCE_USUARIO_INTERNO = 'usuario_interno';
export const APP_RESOURCE_USUARIO_INTERNO_CARGO = 'usuario_interno_cargo';

export const APP_RESOURCES: IAppResource[] = [
  {
    resource: APP_RESOURCE_PERMISSAO,

    search: {
      meilisearchIndex: 'permissao',
      searchable: ['id', 'descricao', 'acao', 'recurso'],
      filterable: ['id', 'acao', 'recurso'],
      sortable: ['id', 'acao', 'recurso'],
      getSearchableDataView: () => ['id', 'descricao', 'acao', 'recurso'],
    },

    getTypeormEntity: () => PermissaoDbEntity,

    getTypeormRepositoryFactory: () => getPermissaoRepository,
  },

  {
    resource: APP_RESOURCE_CARGO,

    search: {
      meilisearchIndex: 'cargo',
      searchable: ['id', 'slug'],
      filterable: ['id', 'slug'],
      sortable: ['id', 'slug'],
      getSearchableDataView: () => ['id', 'slug'],
    },

    getTypeormEntity: () => CargoDbEntity,

    getTypeormRepositoryFactory: () => getCargoRepository,
  },

  {
    resource: APP_RESOURCE_CARGO_PERMISSAO,

    search: null,

    // search: {
    //   meilisearchIndex: 'cargo_permissao',
    //   searchable: ['id', 'cargo.id', 'permissao.id'],
    //   filterable: ['id', 'cargo.id', 'permissao.id'],
    //   sortable: ['id', 'cargo.id', 'permissao.id'],
    //   getSearchableDataView: () => ['id', 'cargo.id', 'permissao.id'],
    // },

    getTypeormEntity: () => CargoPermissaoDbEntity,

    getTypeormRepositoryFactory: () => getCargoPermissaoRepository,
  },

  {
    resource: APP_RESOURCE_USUARIO,

    search: {
      meilisearchIndex: 'usuario',
      searchable: ['id', 'email', 'matriculaSiape'],
      filterable: ['id', 'email', 'matriculaSiape'],
      sortable: ['id', 'email', 'matriculaSiape'],
      getSearchableDataView: () => ['id', 'email', 'matriculaSiape'],
    },

    getTypeormEntity: () => UsuarioDbEntity,

    getTypeormRepositoryFactory: () => getUsuarioRepository,
  },

  {
    resource: APP_RESOURCE_USUARIO_CARGO,

    search: null,

    // search: {
    //   meilisearchIndex: 'usuario_cargo',
    //   searchable: ['id', 'usuario.id', 'cargo.id'],
    //   filterable: ['id', 'usuario.id', 'cargo.id'],
    //   sortable: ['id', 'usuario.id', 'cargo.id'],
    //   getSearchableDataView: () => ['id', 'usuario.id', 'cargo.id'],
    // },

    getTypeormEntity: () => UsuarioCargoDbEntity,

    getTypeormRepositoryFactory: () => getUsuarioCargoRepository,
  },

  {
    resource: APP_RESOURCE_USUARIO_INTERNO,

    search: {
      meilisearchIndex: 'usuario_interno',
      searchable: ['id', 'tipoAtor'],
      filterable: ['id', 'tipoAtor'],
      sortable: ['id', 'tipoAtor'],
      getSearchableDataView: () => ['id', 'tipoAtor'],
    },

    getTypeormEntity: () => UsuarioInternoDbEntity,
    getTypeormRepositoryFactory: () => getUsuarioInternoRepository,
  },

  {
    resource: APP_RESOURCE_USUARIO_INTERNO_CARGO,

    search: null,

    // search: {
    //   meilisearchIndex: 'usuario_cargo',
    //   searchable: ['id', 'usuario.id', 'cargo.id'],
    //   filterable: ['id', 'usuario.id', 'cargo.id'],
    //   sortable: ['id', 'usuario.id', 'cargo.id'],
    //   getSearchableDataView: () => ['id', 'usuario.id', 'cargo.id'],
    // },

    getTypeormEntity: () => UsuarioInternoCargoDbEntity,
    getTypeormRepositoryFactory: () => getUsuarioInternoCargoRepository,
  },
];

export const getAppResource = (resource: string) => {
  return APP_RESOURCES.find((appResource) => appResource.resource === resource) ?? null;
};
