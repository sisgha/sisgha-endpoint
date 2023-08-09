import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindUsuarioCargoByIdInputZod = z.object({
  id: IdZod,
});
