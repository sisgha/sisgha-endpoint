import { IAuthorizationConstraintRecipeResolutionMode } from './IAuthorizationConstraintRecipeResolutionMode';
import { IAuthorizationConstraintRecipeType } from './IAuthorizationConstraintRecipeType';

export interface IAuthorizationConstraintRecipeBase<T extends IAuthorizationConstraintRecipeType> {
  /**
   * @description Type of the recipe
   */
  type: T;

  resolutionMode: IAuthorizationConstraintRecipeResolutionMode;

  caslInverted?: boolean;
}
