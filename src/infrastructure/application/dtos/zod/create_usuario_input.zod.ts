import { z } from 'zod';

export const CreateUsuarioInputZod = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  matriculaSiape: z.string(),
});
