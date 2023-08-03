import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindUsuarioInternoCargoByIdInputZod = z.object({
  id: IdZod,
});
