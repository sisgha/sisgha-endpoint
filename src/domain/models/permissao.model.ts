import { IAuthorizationConstraintRecipe } from '../authorization-constraints';
import { ISearchableEntity } from '../search/ISearchableEntity';

export interface PermissaoModel extends ISearchableEntity {
  id: number;

  // ...

  descricao: string;
  acao: string;
  recurso: string;
  constraint: IAuthorizationConstraintRecipe;
}
