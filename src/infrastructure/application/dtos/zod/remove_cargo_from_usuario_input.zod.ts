import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const RemoveCargoFromUsuarioInputZod = z.object({
  cargoId: IdZod,
  usuarioId: IdZod,
});
