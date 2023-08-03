import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const RemoveCargoFromUsuarioInternoInputZod = z.object({
  cargoId: IdZod,
  usuarioInternoId: IdZod,
});
