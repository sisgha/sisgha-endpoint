import { z } from 'zod';

export const CreateCargoInputZod = z.object({
  slug: z.string(),
});
