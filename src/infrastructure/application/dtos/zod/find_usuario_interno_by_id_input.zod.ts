import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindUsuarioInternoByIdInputZod = z.object({
  id: IdZod,
});
