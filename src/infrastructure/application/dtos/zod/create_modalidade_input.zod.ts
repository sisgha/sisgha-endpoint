import { z } from 'zod';

export const CreateModalidadeInputZod = z.object({
  slug: z.string().trim().min(1),
});
