import { z } from 'zod';

export const GenericListInputZod = z.object({
  query: z.string().default(''),

  limit: z.number().int().positive().min(1).max(100).default(10),
  offset: z.number().int().positive().min(0).optional(),

  filter: z.string().optional(),
  sort: z.string().array().optional(),
});
