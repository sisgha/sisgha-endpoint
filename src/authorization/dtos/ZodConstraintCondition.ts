import { z } from 'zod';

export const ZodConstraintCondition = z.record(z.string(), z.any());
