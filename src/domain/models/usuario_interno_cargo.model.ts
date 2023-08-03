import { CargoModel } from './cargo.model';
import { UsuarioInternoModel } from './usuario_interno.model';

export interface UsuarioInternoCargoModel {
  id: number;

  // ...

  usuarioInterno: UsuarioInternoModel;
  cargo: CargoModel;
}
