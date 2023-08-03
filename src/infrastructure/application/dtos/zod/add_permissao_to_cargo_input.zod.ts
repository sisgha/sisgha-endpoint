import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const AddPermissaoToCargoInputZod = z.object({
  cargoId: IdZod,
  permissaoId: IdZod,
});
