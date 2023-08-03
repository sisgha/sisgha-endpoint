import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const RemovePermissaoFromCargoInputZod = z.object({
  cargoId: IdZod,
  permissaoId: IdZod,
});
