import { IAuthorizationConstraintRecipeType } from '../authorization-constraint-recipe';
import { IAuthorizationConstraintRecipeBase } from '../authorization-constraint-recipe/IAuthorizationConstraintRecipeBase';
import { IAuthorizationConstraintRecipeFilterCondition } from './IAuthorizationConstraintRecipeFilterCondition';
import { IAuthorizationConstraintRecipeFilterJoin } from './IAuthorizationConstraintRecipeFilterJoin';

export interface IAuthorizationConstraintRecipeFilter
  extends IAuthorizationConstraintRecipeBase<IAuthorizationConstraintRecipeType.FILTER> {
  type: IAuthorizationConstraintRecipeType.FILTER;

  /**
   * @description Alias of the resource
   */
  alias: string;

  /**
   * @description The relations to other resources.
   */
  joins: IAuthorizationConstraintRecipeFilterJoin[];

  /**
   * @description The condition of the filter. Despite the target database system, such as SQL Query or MongoDB Query, the condition is a JSON object that represents the condition and follows the MongoDB Query Language structure.
   * @see https://github.com/stalniy/ucast/tree/master/packages/sql#readme
   * @see https://github.com/stalniy/ucast/tree/master/packages/mongo#readme
   */
  condition: IAuthorizationConstraintRecipeFilterCondition;
}
