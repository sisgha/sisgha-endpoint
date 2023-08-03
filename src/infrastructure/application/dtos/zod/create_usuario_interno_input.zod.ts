import { z } from 'zod';

export const CreateUsuarioInternoInputZod = z.object({
  tipoEntidade: z.string(),
});
