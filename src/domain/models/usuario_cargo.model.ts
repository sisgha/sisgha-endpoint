import { UsuarioModel } from './usuario.model';
import { CargoModel } from './cargo.model';

export interface UsuarioCargoModel {
  id: number;
  // ...
  usuario: UsuarioModel;
  cargo: CargoModel;
}
