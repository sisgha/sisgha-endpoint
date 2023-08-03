import { CargoModel } from './cargo.model';
import { PermissaoModel } from './permissao.model';

export interface CargoPermissaoModel {
  id: number;

  // ...

  cargo: CargoModel;
  permissao: PermissaoModel;
}
