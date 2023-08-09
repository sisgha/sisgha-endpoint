import { ISearchableEntity } from '../search/ISearchableEntity';

export interface UsuarioModel extends ISearchableEntity {
  id: number;

  // ...

  nome: string | null;
  email: string | null;
  keycloakId: string | null;
  matriculaSiape: string | null;
}
