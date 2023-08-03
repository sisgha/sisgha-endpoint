import { z } from 'zod';

export const CreateUsuarioInputZod = z.object({
  email: z.string().email(),
  matriculaSiape: z.string().optional(),
});
