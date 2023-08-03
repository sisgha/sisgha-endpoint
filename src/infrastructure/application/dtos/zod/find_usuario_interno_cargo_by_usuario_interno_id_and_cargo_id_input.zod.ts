import { z } from 'zod';
import { IdZod } from './literals/id.zod';

export const FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInputZod = z.object({
  usuarioInternoId: IdZod,
  cargoId: IdZod,
});
