import { ISearchableEntity } from '../search/ISearchableEntity';

export interface UsuarioInternoModel extends ISearchableEntity {
  id: number;

  // ...

  tipoEntidade: string;
}
