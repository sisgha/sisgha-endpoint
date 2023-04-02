import { z } from 'zod';

export const GenericSearchInputZod = z.object({
  query: z.string().default(''),

  limit: z.number().int().positive().min(1).max(100).optional(),
  offset: z.number().int().positive().min(0).optional(),
});

export type IGenericSearchResult<T> = {
  query: string;

  limit: number;
  offset: number;

  total: number;

  items: T[];
};
