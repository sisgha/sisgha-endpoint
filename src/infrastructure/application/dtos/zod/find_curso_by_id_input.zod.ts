import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindCursoByIdInputZod = z.object({
  id: IdZod,
});
