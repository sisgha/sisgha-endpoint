import { IAppResource } from '../../../domain/application-resources';
import { CargoResource } from '../resources/cargo/cargo.resource';
import { CargoPermissaoResource } from '../resources/cargo_permissao/cargo_permissao.resource';
import { PermissaoResource } from '../resources/permissao/permissao.resource';
import { UsuarioResource } from '../resources/usuario/usuario.resource';
import { UsuarioCargoResource } from '../resources/usuario_cargo/usuario_cargo.resource';
import { UsuarioInternoResource } from '../resources/usuario_interno/usuario_interno.resource';
import { UsuarioInternoCargoResource } from '../resources/usuario_interno_cargo/usuario_interno_cargo.resource';

export const APP_RESOURCES: IAppResource<any>[] = [
  // ...
  CargoResource,
  CargoPermissaoResource,
  PermissaoResource,
  UsuarioResource,
  UsuarioCargoResource,
  UsuarioInternoResource,
  UsuarioInternoCargoResource,
];
