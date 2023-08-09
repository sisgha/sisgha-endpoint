import { IAuthorizationConstraintRecipe } from '../authorization-constraints';
import { ISearchableEntity } from '../search/ISearchableEntity';

export interface PermissaoModel extends ISearchableEntity {
  id: number;

  // ...

  descricao: string;

  verboGlobal: boolean;
  recursoGlobal: boolean;

  authorizationConstraintRecipe: IAuthorizationConstraintRecipe;
}
