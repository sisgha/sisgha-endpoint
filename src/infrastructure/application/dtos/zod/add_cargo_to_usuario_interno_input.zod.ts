import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const AddCargoToUsuarioInternoInputZod = z.object({
  cargoId: IdZod,
  usuarioInternoId: IdZod,
});
