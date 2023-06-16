import { z } from 'zod';
import { ZodConstraintAlias } from './ZodConstraintAlias';
import { ZodConstraintCondition } from './ZodConstraintCondition';
import { ZodConstraintJoinMode } from './ZodConstraintJoinMode';
import { ZodConstraintResource } from './ZodConstraintResource';

export const ZodConstraintJoin = z.object({
  mode: ZodConstraintJoinMode,

  resource: ZodConstraintResource,
  alias: ZodConstraintAlias,

  condition: ZodConstraintCondition,
});
