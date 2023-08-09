import { IAuthorizationConstraintRecipe } from '../authorization-constraints';

export type IUpdatePermissaoInput = {
  id: number;

  descricao?: string;
  authorizationConstraintRecipe?: IAuthorizationConstraintRecipe;

  verboGlobal?: boolean;
  verbos?: string[];

  recursoGlobal?: boolean;
  recursos?: string[];
};
