import { IAuthorizationConstraintRecipe } from 'recipe-guard/packages/core';

export interface ICreatePermissaoInput {
  descricao: string;
  authorizationConstraintRecipe: IAuthorizationConstraintRecipe;

  verboGlobal: boolean;
  verbos: string[];

  recursoGlobal: boolean;
  recursos: string[];
}
