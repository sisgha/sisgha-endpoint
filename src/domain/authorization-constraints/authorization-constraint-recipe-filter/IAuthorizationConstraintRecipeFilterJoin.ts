import { AuthorizationConstraintJoinMode } from '../tokens';
import { IAuthorizationConstraintRecipeFilterCondition } from './IAuthorizationConstraintRecipeFilterCondition';

export type IAuthorizationConstraintRecipeFilterJoin = {
  mode: AuthorizationConstraintJoinMode;

  resource: string;
  alias: string;

  condition: IAuthorizationConstraintRecipeFilterCondition;
};
