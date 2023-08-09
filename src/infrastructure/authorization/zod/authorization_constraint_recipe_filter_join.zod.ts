import { z } from 'zod';
import { AuthorizationConstraintAliasZod } from './authorization_constraint_alias.zod';
import { AuthorizationConstraintRecipeFilterConditionZod } from './authorization_constraint_recipe_filter_condition.zod';
import { AuthorizationConstraintRecipeFilterJoinModeZod } from './authorization_constraint_recipe_filter_join_mode.zod';
import { AuthorizationConstraintResourceZod } from './authorization_constraint_resource.zod';

export const AuthorizationConstraintRecipeFilterJoinZod = z.object({
  mode: AuthorizationConstraintRecipeFilterJoinModeZod,

  resource: AuthorizationConstraintResourceZod,
  alias: AuthorizationConstraintAliasZod,

  condition: AuthorizationConstraintRecipeFilterConditionZod,
});
