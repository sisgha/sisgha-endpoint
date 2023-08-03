import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindCargoByIdInputZod = z.object({
  id: IdZod,
});
