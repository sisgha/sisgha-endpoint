import { z } from 'zod';
import {
  IAuthorizationConstraintRecipeResolutionMode,
  IAuthorizationConstraintRecipeType,
} from '../../../domain/authorization-constraints';
import { AuthorizationConstraintAliasZod } from './authorization_constraint_alias.zod';
import { AuthorizationConstraintRecipeFilterConditionZod } from './authorization_constraint_recipe_filter_condition.zod';
import { AuthorizationConstraintRecipeFilterJoinZod } from './authorization_constraint_recipe_filter_join.zod';

const AuthorizationConstraintRecipeBaseZod = z.object({
  resolutionMode: z.nativeEnum(IAuthorizationConstraintRecipeResolutionMode),
  caslInverted: z.boolean().optional(),
});

const AuthorizationConstraintRecipeBooleanZod = AuthorizationConstraintRecipeBaseZod.extend({
  type: z.literal(IAuthorizationConstraintRecipeType.BOOLEAN),
  value: z.boolean(),
}).strict();

const AuthorizationConstraintRecipeFilterZod = z
  .object({
    type: z.literal(IAuthorizationConstraintRecipeType.FILTER),

    alias: AuthorizationConstraintAliasZod,
    joins: z.array(AuthorizationConstraintRecipeFilterJoinZod),
    condition: AuthorizationConstraintRecipeFilterConditionZod,
  })
  .strict();

export const AuthorizationConstraintRecipeZod = z.discriminatedUnion('type', [
  AuthorizationConstraintRecipeBooleanZod,
  AuthorizationConstraintRecipeFilterZod,
]);
