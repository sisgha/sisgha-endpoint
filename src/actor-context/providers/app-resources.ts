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

export const APP_RESOURCES: IAppResource[] = [
  {
    resource: APP_RESOURCE_PERMISSAO,

    searchable: ['id', 'descricao', 'acao', 'recurso'],

    filterable: ['id', 'acao', 'recurso'],
    sortable: ['id', 'acao', 'recurso'],

    getTypeormEntity: () => PermissaoDbEntity,
    getSearchableDataView: () => ['id', 'descricao', 'acao', 'recurso'],
    getTypeormRepositoryFactory: () => getPermissaoRepository,
  },

  {
    resource: APP_RESOURCE_CARGO,

    searchable: ['id', 'slug'],

    filterable: ['id', 'slug'],
    sortable: ['id', 'slug'],

    getTypeormEntity: () => CargoDbEntity,
    getSearchableDataView: () => ['id', 'slug'],
    getTypeormRepositoryFactory: () => getCargoRepository,
  },

  {
    resource: APP_RESOURCE_CARGO_PERMISSAO,

    searchable: ['id', 'cargo.id', 'permissao.id'],

    filterable: ['id', 'cargo.id', 'permissao.id'],
    sortable: ['id', 'cargo.id', 'permissao.id'],

    getTypeormEntity: () => CargoPermissaoDbEntity,
    getSearchableDataView: () => ['id', 'cargo.id', 'permissao.id'],
    getTypeormRepositoryFactory: () => getCargoPermissaoRepository,
  },

  {
    resource: APP_RESOURCE_USUARIO,

    searchable: ['id', 'email', 'matriculaSiape'],

    filterable: ['id', 'email', 'matriculaSiape'],
    sortable: ['id', 'email', 'matriculaSiape'],

    getTypeormEntity: () => UsuarioDbEntity,
    getSearchableDataView: () => ['id', 'email', 'matriculaSiape'],
    getTypeormRepositoryFactory: () => getUsuarioRepository,
  },

  {
    resource: APP_RESOURCE_USUARIO_CARGO,

    searchable: ['id', 'usuario.id', 'cargo.id'],

    filterable: ['id', 'usuario.id', 'cargo.id'],
    sortable: ['id', 'usuario.id', 'cargo.id'],

    getTypeormEntity: () => UsuarioCargoDbEntity,
    getSearchableDataView: () => ['id', 'usuario.id', 'cargo.id'],
    getTypeormRepositoryFactory: () => getUsuarioCargoRepository,
  },
];

export const getAppResource = (resource: string) => {
  return APP_RESOURCES.find((appResource) => appResource.resource === resource) ?? null;
};
