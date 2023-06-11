import { z } from 'zod';

export const ZodConstraintConditionSQLValue = z.object({
  $field: z.string(),
});
