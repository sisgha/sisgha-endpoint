import { z } from 'zod';
import { AuthorizationConstraintAliasZod } from './authorization_constraint_alias.zod';
import { AuthorizationConstraintRecipeFilterConditionZod } from './authorization_constraint_recipe_filter_condition.zod';
import { AuthorizationConstraintRecipeFilterJoinZod } from './authorization_constraint_recipe_filter_join.zod';
import { IAuthorizationConstraintRecipeType } from '../../../domain/authorization-constraints';

export const AuthorizationConstraintRecipeZod = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(IAuthorizationConstraintRecipeType.BOOLEAN),
    value: z.boolean(),
  }),

  z.object({
    type: z.literal(IAuthorizationConstraintRecipeType.FILTER),

    mode: z.enum(['include']).default('include'),

    alias: AuthorizationConstraintAliasZod,

    joins: z.array(AuthorizationConstraintRecipeFilterJoinZod),

    condition: AuthorizationConstraintRecipeFilterConditionZod,
  }),
]);
