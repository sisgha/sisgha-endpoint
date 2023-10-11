import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindModalidadeByIdInputZod = z.object({
  id: IdZod,
});
