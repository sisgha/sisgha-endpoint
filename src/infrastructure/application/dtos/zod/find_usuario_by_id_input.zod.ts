import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindUsuarioByIdInputZod = z.object({
  id: IdZod,
});
