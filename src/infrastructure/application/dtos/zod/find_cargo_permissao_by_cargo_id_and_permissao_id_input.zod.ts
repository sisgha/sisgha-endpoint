import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindCargoPermissaoByCargoIdAndPermissaoIdInputZod = z.object({
  cargoId: IdZod,
  permissaoId: IdZod,
});
