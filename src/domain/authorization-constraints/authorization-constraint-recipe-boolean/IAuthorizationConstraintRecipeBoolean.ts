import { IAuthorizationConstraintRecipeType } from '../authorization-constraint-recipe';
import { IAuthorizationConstraintRecipeBase } from '../authorization-constraint-recipe/IAuthorizationConstraintRecipeBase';

export interface IAuthorizationConstraintRecipeBoolean
  extends IAuthorizationConstraintRecipeBase<IAuthorizationConstraintRecipeType.BOOLEAN> {
  type: IAuthorizationConstraintRecipeType.BOOLEAN;
  value: boolean;
}
