import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindCargoPermissaoByIdInputZod = z.object({
  id: IdZod,
});
