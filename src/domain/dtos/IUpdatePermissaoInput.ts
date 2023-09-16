import { IAuthorizationConstraintRecipe } from 'recipe-guard/packages/core';

export type IUpdatePermissaoInput = {
  id: number;

  descricao?: string;
  authorizationConstraintRecipe?: IAuthorizationConstraintRecipe;

  verboGlobal?: boolean;
  verbos?: string[];

  recursoGlobal?: boolean;
  recursos?: string[];
};
