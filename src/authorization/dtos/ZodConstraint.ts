import { z } from 'zod';
import { ZodConstraintAlias } from './ZodConstraintAlias';
import { ZodConstraintCondition } from './ZodConstraintCondition';
import { ZodConstraintJoin } from './ZodConstraintJoin';
import { ZodConstraintResource } from './ZodConstraintResource';

export const ZodConstraint = z.union([
  z.boolean(),
  z.object({
    resource: ZodConstraintResource,

    alias: ZodConstraintAlias,

    condition: ZodConstraintCondition,
    joins: z.array(ZodConstraintJoin),
  }),
]);
