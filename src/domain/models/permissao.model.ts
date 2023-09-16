import { IAuthorizationConstraintRecipe } from 'recipe-guard/packages/core';
import { ISearchableEntity } from '../search/ISearchableEntity';

export interface PermissaoModel extends ISearchableEntity {
  id: number;

  // ...

  descricao: string;

  verboGlobal: boolean;
  recursoGlobal: boolean;

  authorizationConstraintRecipe: IAuthorizationConstraintRecipe;
}
