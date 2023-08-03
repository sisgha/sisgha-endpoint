import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindPermissaoByIdInputZod = z.object({
  id: IdZod,
});
