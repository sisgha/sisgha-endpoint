import { IAuthorizationConstraintRecipe } from '../authorization-constraints';

export interface ICreatePermissaoInput {
  descricao: string;
  authorizationConstraintRecipe: IAuthorizationConstraintRecipe;

  verboGlobal: boolean;
  verbos: string[];

  recursoGlobal: boolean;
  recursos: string[];
}
